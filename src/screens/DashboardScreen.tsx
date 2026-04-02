import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SummaryCard } from '../components/SummaryCard';
import { Transaction } from '../types';
import { calculateTotals, expenseByCategory } from '../utils/insights';

export const DashboardScreen = ({
  transactions,
  goal
}: {
  transactions: Transaction[];
  goal: number;
}) => {
  const totals = calculateTotals(transactions);
  const categories = expenseByCategory(transactions).slice(0, 4);
  const savings = Math.max(totals.balance, 0);
  const progress = goal > 0 ? Math.min((savings / goal) * 100, 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Home Dashboard</Text>

      <View style={styles.grid}>
        <SummaryCard label="Current Balance" value={`$${totals.balance.toFixed(2)}`} tone="neutral" />
        <SummaryCard label="Total Income" value={`$${totals.totalIncome.toFixed(2)}`} tone="positive" />
      </View>

      <View style={styles.grid}>
        <SummaryCard label="Total Expenses" value={`$${totals.totalExpense.toFixed(2)}`} tone="negative" />
        <SummaryCard label="Savings Progress" value={`${progress.toFixed(0)}%`} tone="positive" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Spending by Category</Text>
        {categories.length === 0 ? (
          <Text style={styles.muted}>No expense transactions yet.</Text>
        ) : (
          categories.map((row) => {
            const max = categories[0]?.amount || 1;
            const width = (row.amount / max) * 100;
            return (
              <View key={row.category} style={styles.barRow}>
                <Text style={styles.barLabel}>{row.category}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${width}%` }]} />
                </View>
                <Text style={styles.barValue}>${row.amount.toFixed(0)}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 100
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827'
  },
  grid: {
    flexDirection: 'row',
    gap: 10
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    padding: 14
  },
  panelTitle: {
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827'
  },
  muted: {
    color: '#6b7280'
  },
  barRow: {
    marginBottom: 10
  },
  barLabel: {
    color: '#374151',
    marginBottom: 4
  },
  track: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    backgroundColor: '#3b82f6'
  },
  barValue: {
    textAlign: 'right',
    color: '#374151',
    fontSize: 12,
    marginTop: 2
  }
});
