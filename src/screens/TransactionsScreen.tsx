import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { TransactionItem } from '../components/TransactionItem';
import { Transaction } from '../types';

export const TransactionsScreen = ({
  transactions,
  onAdd,
  onEdit,
  onDelete
}: {
  transactions: Transaction[];
  onAdd: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const list = useMemo(() => {
    return transactions.filter((tx) => {
      const matchType = filter === 'all' || tx.type === filter;
      const q = query.toLowerCase();
      const matchQuery =
        q.length === 0 ||
        tx.category.toLowerCase().includes(q) ||
        (tx.notes || '').toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [transactions, filter, query]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.header}>Transactions</Text>
        <Pressable style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search category or note"
        style={styles.input}
      />

      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as const).map((type) => (
          <Pressable
            key={type}
            style={[styles.filterBtn, filter === type && styles.filterBtnActive]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>{type}</Text>
          </Pressable>
        ))}
      </View>

      {list.length === 0 ? (
        <EmptyState message="Add transactions or adjust your filters." />
      ) : (
        list.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onPress={() => onEdit(tx)}
            onDelete={() => onDelete(tx.id)}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827'
  },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff'
  },
  filterBtnActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8'
  },
  filterText: {
    color: '#374151',
    textTransform: 'capitalize'
  },
  filterTextActive: {
    color: '#fff'
  }
});
