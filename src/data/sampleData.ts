import { Transaction } from '../types';

export const seedTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 3200,
    type: 'income',
    category: 'Salary',
    date: '2026-03-01',
    notes: 'Monthly paycheck'
  },
  {
    id: 't2',
    amount: 62,
    type: 'expense',
    category: 'Food',
    date: '2026-03-02',
    notes: 'Groceries'
  },
  {
    id: 't3',
    amount: 24,
    type: 'expense',
    category: 'Transport',
    date: '2026-03-03',
    notes: 'Metro top-up'
  },
  {
    id: 't4',
    amount: 410,
    type: 'income',
    category: 'Freelance',
    date: '2026-03-05',
    notes: 'Design side project'
  },
  {
    id: 't5',
    amount: 95,
    type: 'expense',
    category: 'Bills',
    date: '2026-03-06',
    notes: 'Internet + mobile'
  },
  {
    id: 't6',
    amount: 135,
    type: 'expense',
    category: 'Shopping',
    date: '2026-03-07',
    notes: 'Home essentials'
  }
];
