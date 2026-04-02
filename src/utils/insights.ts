import { Transaction } from '../types';

export const calculateTotals = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  };
};

export const expenseByCategory = (transactions: Transaction[]) => {
  const bucket: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      bucket[t.category] = (bucket[t.category] ?? 0) + t.amount;
    });

  return Object.entries(bucket)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

const isWithinDays = (dateIso: string, days: number) => {
  const now = new Date();
  const txDate = new Date(dateIso);
  const ms = now.getTime() - txDate.getTime();
  return ms >= 0 && ms <= days * 24 * 60 * 60 * 1000;
};

export const spendingDeltaWeek = (transactions: Transaction[]) => {
  const currentWeek = transactions
    .filter((t) => t.type === 'expense' && isWithinDays(t.date, 7))
    .reduce((sum, t) => sum + t.amount, 0);

  const lastWeek = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const now = new Date();
      const txDate = new Date(t.date);
      const days = (now.getTime() - txDate.getTime()) / (24 * 60 * 60 * 1000);
      return days > 7 && days <= 14;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return { currentWeek, lastWeek, difference: currentWeek - lastWeek };
};
