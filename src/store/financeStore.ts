import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { seedTransactions } from '../data/sampleData';
import { SavingsGoal, Transaction } from '../types';

const STORAGE_KEY = 'finance-companion/v1';

interface FinanceState {
  transactions: Transaction[];
  goal: SavingsGoal;
  isReady: boolean;
  load: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setGoal: (monthlyTarget: number) => void;
}

const persistState = async (transactions: Transaction[], goal: SavingsGoal) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, goal }));
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  goal: { monthlyTarget: 1000 },
  isReady: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          transactions: Transaction[];
          goal: SavingsGoal;
        };
        set({
          transactions: parsed.transactions,
          goal: parsed.goal,
          isReady: true
        });
        return;
      }
      set({ transactions: seedTransactions, isReady: true });
      await persistState(seedTransactions, get().goal);
    } catch {
      set({ transactions: seedTransactions, isReady: true });
    }
  },

  addTransaction: (transaction) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      ...transaction
    };
    const transactions = [newTx, ...get().transactions].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    set({ transactions });
    void persistState(transactions, get().goal);
  },

  updateTransaction: (id, transaction) => {
    const transactions = get().transactions
      .map((item) => (item.id === id ? { id, ...transaction } : item))
      .sort((a, b) => b.date.localeCompare(a.date));
    set({ transactions });
    void persistState(transactions, get().goal);
  },

  deleteTransaction: (id) => {
    const transactions = get().transactions.filter((item) => item.id !== id);
    set({ transactions });
    void persistState(transactions, get().goal);
  },

  setGoal: (monthlyTarget) => {
    const goal = { monthlyTarget };
    set({ goal });
    void persistState(get().transactions, goal);
  }
}));
