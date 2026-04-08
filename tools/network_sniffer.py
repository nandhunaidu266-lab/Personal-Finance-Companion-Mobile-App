#!/usr/bin/env python3
"""Network packet sniffing and analysis tool.

Features:
- Live sniffing with protocol/port/BPF-style filter options.
- Basic per-flow statistics (packet count, bytes, top talkers).
- Optional PCAP output.
- Offline analysis of an existing PCAP file.

Usage examples:
  python tools/network_sniffer.py live --iface eth0 --count 100 --protocol tcp
  python tools/network_sniffer.py live --duration 30 --save capture.pcap
  python tools/network_sniffer.py analyze --pcap capture.pcap --top 10
"""

from __future__ import annotations

import argparse
import collections
import ipaddress
import sys
import time
from dataclasses import dataclass
from typing import DefaultDict, Iterable

try:
    from scapy.all import IP, IPv6, TCP, UDP, ICMP, DNS, Raw, sniff, wrpcap, rdpcap  # type: ignore
except Exception as exc:  # pragma: no cover - import error path
    print(
        "Error: scapy is required. Install it with: pip install scapy",
        file=sys.stderr,
    )
    raise SystemExit(1) from exc


@dataclass
class PacketInfo:
    timestamp: float
    src: str
    dst: str
    protocol: str
    src_port: int | None
    dst_port: int | None
    length: int


class Stats:
    def __init__(self) -> None:
        self.total_packets = 0
        self.total_bytes = 0
        self.by_protocol: DefaultDict[str, int] = collections.defaultdict(int)
        self.by_source: DefaultDict[str, int] = collections.defaultdict(int)
        self.by_destination: DefaultDict[str, int] = collections.defaultdict(int)
        self.by_flow_packets: DefaultDict[tuple[str, str, str, int | None, int | None], int] = (
            collections.defaultdict(int)
        )
        self.by_flow_bytes: DefaultDict[tuple[str, str, str, int | None, int | None], int] = (
            collections.defaultdict(int)
        )

    def add(self, packet_info: PacketInfo) -> None:
        self.total_packets += 1
        self.total_bytes += packet_info.length
        self.by_protocol[packet_info.protocol] += 1
        self.by_source[packet_info.src] += 1
        self.by_destination[packet_info.dst] += 1
        flow_key = (
            packet_info.src,
            packet_info.dst,
            packet_info.protocol,
            packet_info.src_port,
            packet_info.dst_port,
        )
        self.by_flow_packets[flow_key] += 1
        self.by_flow_bytes[flow_key] += packet_info.length


def extract_packet_info(packet) -> PacketInfo | None:
    src = dst = None
    protocol = "OTHER"
    src_port = dst_port = None

    if IP in packet:
        src = packet[IP].src
        dst = packet[IP].dst
    elif IPv6 in packet:
        src = packet[IPv6].src
        dst = packet[IPv6].dst
    else:
        return None

    if TCP in packet:
        protocol = "TCP"
        src_port = int(packet[TCP].sport)
        dst_port = int(packet[TCP].dport)
    elif UDP in packet:
        protocol = "UDP"
        src_port = int(packet[UDP].sport)
        dst_port = int(packet[UDP].dport)
        if DNS in packet:
            protocol = "DNS"
    elif ICMP in packet:
        protocol = "ICMP"

    return PacketInfo(
        timestamp=float(packet.time),
        src=str(src),
        dst=str(dst),
        protocol=protocol,
        src_port=src_port,
        dst_port=dst_port,
        length=len(packet),
    )


def validate_ip_or_network(value: str) -> str:
    try:
        ipaddress.ip_network(value, strict=False)
        return value
    except ValueError as exc:
        raise argparse.ArgumentTypeError(f"Invalid IP/network: {value}") from exc


def build_filter(protocol: str | None, port: int | None, host: str | None, user_filter: str | None) -> str | None:
    parts: list[str] = []
    if protocol:
        parts.append(protocol.lower())
    if port is not None:
        parts.append(f"port {port}")
    if host:
        parts.append(f"host {host}")
    if user_filter:
        parts.append(f"({user_filter})")
    return " and ".join(parts) if parts else None


def print_packet_line(packet_info: PacketInfo, show_payload: bool, packet) -> None:
    ts = time.strftime("%H:%M:%S", time.localtime(packet_info.timestamp))
    src = f"{packet_info.src}:{packet_info.src_port}" if packet_info.src_port else packet_info.src
    dst = f"{packet_info.dst}:{packet_info.dst_port}" if packet_info.dst_port else packet_info.dst
    line = f"[{ts}] {packet_info.protocol:<5} {src:<27} -> {dst:<27} len={packet_info.length}"

    if show_payload and Raw in packet:
        payload = bytes(packet[Raw].load[:32]).hex()
        line += f" payload={payload}"

    print(line)


def analyze_packets(packets: Iterable, show_packets: bool, show_payload: bool) -> Stats:
    stats = Stats()
    for packet in packets:
        info = extract_packet_info(packet)
        if info is None:
            continue
        stats.add(info)
        if show_packets:
            print_packet_line(info, show_payload, packet)
    return stats


def print_summary(stats: Stats, top: int) -> None:
    print("\n=== Capture Summary ===")
    print(f"Total packets: {stats.total_packets}")
    print(f"Total bytes:   {stats.total_bytes}")

    if stats.total_packets == 0:
        return

    print("\nBy protocol:")
    for protocol, count in sorted(stats.by_protocol.items(), key=lambda item: item[1], reverse=True):
        pct = (count / stats.total_packets) * 100
        print(f"  {protocol:<6} {count:>8} ({pct:5.1f}%)")

    print(f"\nTop {top} source IPs:")
    for source, count in sorted(stats.by_source.items(), key=lambda item: item[1], reverse=True)[:top]:
        print(f"  {source:<40} {count:>8}")

    print(f"\nTop {top} destination IPs:")
    for destination, count in sorted(stats.by_destination.items(), key=lambda item: item[1], reverse=True)[:top]:
        print(f"  {destination:<40} {count:>8}")

    print(f"\nTop {top} flows (packets / bytes):")
    sorted_flows = sorted(stats.by_flow_packets.items(), key=lambda item: item[1], reverse=True)[:top]
    for flow, packet_count in sorted_flows:
        flow_bytes = stats.by_flow_bytes[flow]
        src, dst, proto, sport, dport = flow
        src_label = f"{src}:{sport}" if sport else src
        dst_label = f"{dst}:{dport}" if dport else dst
        print(f"  {proto:<5} {src_label:<30} -> {dst_label:<30} {packet_count:>6} / {flow_bytes:>8}")


def run_live(args: argparse.Namespace) -> int:
    capture_filter = build_filter(args.protocol, args.port, args.host, args.filter)
    if args.verbose:
        print(f"Using capture filter: {capture_filter or '(none)'}")

    packets = sniff(
        iface=args.iface,
        count=args.count,
        timeout=args.duration,
        filter=capture_filter,
        store=True,
    )

    stats = analyze_packets(packets, show_packets=args.packets, show_payload=args.payload)

    if args.save:
        wrpcap(args.save, packets)
        print(f"Saved {len(packets)} packets to {args.save}")

    print_summary(stats, top=args.top)
    return 0


def run_analyze(args: argparse.Namespace) -> int:
    packets = rdpcap(args.pcap)
    stats = analyze_packets(packets, show_packets=args.packets, show_payload=args.payload)
    print_summary(stats, top=args.top)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Network packet sniffing and analysis tool")
    subparsers = parser.add_subparsers(dest="command", required=True)

    live = subparsers.add_parser("live", help="Capture packets from a network interface")
    live.add_argument("--iface", help="Network interface (default: scapy default interface)")
    live.add_argument("--count", type=int, default=0, help="Number of packets to capture (0 means unlimited)")
    live.add_argument("--duration", type=int, help="Capture duration in seconds")
    live.add_argument("--protocol", choices=["tcp", "udp", "icmp"], help="Protocol filter")
    live.add_argument("--port", type=int, help="Port filter")
    live.add_argument("--host", type=validate_ip_or_network, help="Host/IP/CIDR filter")
    live.add_argument("--filter", help="Raw BPF filter expression")
    live.add_argument("--save", help="Write captured packets to PCAP file")
    live.add_argument("--packets", action="store_true", help="Print each captured packet")
    live.add_argument("--payload", action="store_true", help="Print first 32 bytes of payload as hex")
    live.add_argument("--top", type=int, default=5, help="Top N entries in summary")
    live.add_argument("--verbose", action="store_true", help="Show extra runtime details")
    live.set_defaults(func=run_live)

    analyze = subparsers.add_parser("analyze", help="Analyze packets from an existing PCAP")
    analyze.add_argument("--pcap", required=True, help="Path to PCAP file")
    analyze.add_argument("--packets", action="store_true", help="Print each packet")
    analyze.add_argument("--payload", action="store_true", help="Print first 32 bytes of payload as hex")
    analyze.add_argument("--top", type=int, default=5, help="Top N entries in summary")
    analyze.set_defaults(func=run_analyze)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
