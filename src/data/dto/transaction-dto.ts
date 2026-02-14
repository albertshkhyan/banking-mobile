export type TransactionDto = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  description: string;
  date: string;
};
