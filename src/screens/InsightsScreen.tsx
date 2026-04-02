import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../types';
import { expenseByCategory, spendingDeltaWeek } from '../utils/insights';

export const InsightsScreen = ({ transactions }: { transactions: Transaction[] }) => {
  const topCategory = expenseByCategory(transactions)[0];
  const weekly = spendingDeltaWeek(transactions);

  const monthlyExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Insights</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Highest Spending Category</Text>
        <Text style={styles.value}>
          {topCategory ? `${topCategory.category} ($${topCategory.amount.toFixed(2)})` : 'No data yet'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>This Week vs Last Week</Text>
        <Text style={styles.value}>This week: ${weekly.currentWeek.toFixed(2)}</Text>
        <Text style={styles.value}>Last week: ${weekly.lastWeek.toFixed(2)}</Text>
        <Text style={[styles.value, weekly.difference > 0 ? styles.bad : styles.good]}>
          {weekly.difference > 0 ? '↑' : '↓'} {Math.abs(weekly.difference).toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Monthly Snapshot</Text>
        <Text style={styles.value}>Income: ${monthlyIncome.toFixed(2)}</Text>
        <Text style={styles.value}>Expense: ${monthlyExpense.toFixed(2)}</Text>
        <Text style={styles.value}>Net: ${(monthlyIncome - monthlyExpense).toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    gap: 10
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827'
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14
  },
  title: {
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '600'
  },
  value: {
    color: '#111827',
    fontSize: 16,
    marginBottom: 2
  },
  bad: {
    color: '#b91c1c'
  },
  good: {
    color: '#15803d'
  }
});
