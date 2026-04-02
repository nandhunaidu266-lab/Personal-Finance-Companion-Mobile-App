import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: () => void;
  onDelete: () => void;
}

export const TransactionItem = ({
  transaction,
  onPress,
  onDelete
}: TransactionItemProps) => {
  const amountText = `${transaction.type === 'expense' ? '-' : '+'}$${transaction.amount.toFixed(2)}`;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.meta}>{transaction.date} • {transaction.notes || 'No note'}</Text>
      </View>
      <View>
        <Text style={[styles.amount, transaction.type === 'expense' ? styles.expense : styles.income]}>{amountText}</Text>
        <Text style={styles.delete} onPress={onDelete}>Delete</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  left: {
    flex: 1,
    paddingRight: 8
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  meta: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 12
  },
  amount: {
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '700'
  },
  income: {
    color: '#15803d'
  },
  expense: {
    color: '#b91c1c'
  },
  delete: {
    marginTop: 6,
    color: '#dc2626',
    fontSize: 12,
    textAlign: 'right'
  }
});
