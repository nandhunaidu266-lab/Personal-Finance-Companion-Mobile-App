export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Salary'
  | 'Freelance'
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Entertainment'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO date string
  notes?: string;
}

export interface SavingsGoal {
  monthlyTarget: number;
}
