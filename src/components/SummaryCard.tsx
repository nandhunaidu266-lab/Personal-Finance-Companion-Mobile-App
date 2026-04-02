import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryCardProps {
  label: string;
  value: string;
  tone?: 'neutral' | 'positive' | 'negative';
}

export const SummaryCard = ({
  label,
  value,
  tone = 'neutral'
}: SummaryCardProps) => {
  return (
    <View style={[styles.card, tone === 'positive' && styles.positive, tone === 'negative' && styles.negative]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  positive: {
    borderColor: '#86efac'
  },
  negative: {
    borderColor: '#fca5a5'
  },
  label: {
    color: '#4b5563',
    fontSize: 12,
    marginBottom: 6
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827'
  }
});
