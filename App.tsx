import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { GoalScreen } from './src/screens/GoalScreen';
import { InsightsScreen } from './src/screens/InsightsScreen';
import { TransactionFormScreen } from './src/screens/TransactionFormScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { useFinanceStore } from './src/store/financeStore';
import { Transaction } from './src/types';
import { calculateTotals } from './src/utils/insights';

type Tab = 'home' | 'transactions' | 'goal' | 'insights';

export default function App() {
  const {
    transactions,
    goal,
    isReady,
    load,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setGoal
  } = useFinanceStore();

  const [tab, setTab] = useState<Tab>('home');
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);

  const content = () => {
    if (!isReady) {
      return (
        <View style={styles.center}>
          <Text>Loading your finance data...</Text>
        </View>
      );
    }

    if (showForm) {
      return (
        <TransactionFormScreen
          initial={editing ?? undefined}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
          onSubmit={(data) => {
            if (editing) {
              updateTransaction(editing.id, data);
            } else {
              addTransaction(data);
            }
            setEditing(null);
            setShowForm(false);
          }}
        />
      );
    }

    switch (tab) {
      case 'home':
        return <DashboardScreen transactions={transactions} goal={goal.monthlyTarget} />;
      case 'transactions':
        return (
          <TransactionsScreen
            transactions={transactions}
            onAdd={() => {
              setEditing(null);
              setShowForm(true);
            }}
            onEdit={(tx) => {
              setEditing(tx);
              setShowForm(true);
            }}
            onDelete={deleteTransaction}
          />
        );
      case 'goal':
        return (
          <GoalScreen
            currentTarget={goal.monthlyTarget}
            savings={Math.max(totals.balance, 0)}
            onSave={setGoal}
          />
        );
      case 'insights':
        return <InsightsScreen transactions={transactions} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.content}>{content()}</View>
      {!showForm && (
        <View style={styles.tabBar}>
          {[
            ['home', 'Home'],
            ['transactions', 'Transactions'],
            ['goal', 'Goal'],
            ['insights', 'Insights']
          ].map(([key, label]) => (
            <TouchableOpacity key={key} onPress={() => setTab(key as Tab)} style={styles.tabBtn}>
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  content: {
    flex: 1
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingVertical: 10
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center'
  },
  tabText: {
    color: '#6b7280',
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#2563eb'
  }
});
