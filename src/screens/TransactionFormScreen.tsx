import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Transaction, TransactionCategory, TransactionType } from '../types';

const categories: TransactionCategory[] = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Other'
];

export const TransactionFormScreen = ({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Transaction;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}) => {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [category, setCategory] = useState<TransactionCategory>(initial?.category ?? 'Food');
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const title = useMemo(() => (initial ? 'Edit Transaction' : 'Add Transaction'), [initial]);

  const submit = () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Validation', 'Date must use YYYY-MM-DD format.');
      return;
    }

    onSubmit({
      amount: value,
      type,
      category,
      date,
      notes: notes.trim()
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0.00"
        style={styles.input}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {(['income', 'expense'] as const).map((t) => (
          <Pressable key={t} style={[styles.chip, t === type && styles.chipActive]} onPress={() => setType(t)}>
            <Text style={[styles.chipText, t === type && styles.chipTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.rowWrap}>
        {categories.map((c) => (
          <Pressable key={c} style={[styles.chip, c === category && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, c === category && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput value={date} onChangeText={setDate} style={styles.input} />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional"
        style={styles.input}
      />

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.cancel]} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.save]} onPress={submit}>
          <Text style={styles.saveText}>{initial ? 'Update' : 'Save'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827'
  },
  label: {
    marginBottom: 6,
    color: '#374151',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff'
  },
  chipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8'
  },
  chipText: {
    color: '#374151'
  },
  chipTextActive: {
    color: '#fff'
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10
  },
  cancel: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff'
  },
  save: {
    backgroundColor: '#2563eb'
  },
  cancelText: {
    color: '#374151',
    fontWeight: '700'
  },
  saveText: {
    color: '#fff',
    fontWeight: '700'
  }
});
