# Tools

## Network Packet Sniffer

`network_sniffer.py` is a Python CLI utility for live packet capture and offline PCAP analysis.

### Requirements

- Python 3.10+
- `scapy` (`pip install scapy`)
- Root/admin privileges for live sniffing on most operating systems

### Usage

```bash
# Live capture: 100 TCP packets on interface eth0
python tools/network_sniffer.py live --iface eth0 --count 100 --protocol tcp

# Live capture with a timeout and pcap output
python tools/network_sniffer.py live --duration 30 --save capture.pcap

# Analyze a saved pcap file
python tools/network_sniffer.py analyze --pcap capture.pcap --top 10
```

### Notes

- Use this tool only on networks and systems you own or are explicitly authorized to monitor.
- `--filter` accepts a standard BPF filter expression and is combined with other filter flags.
