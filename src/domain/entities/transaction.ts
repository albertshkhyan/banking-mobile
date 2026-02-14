/**
 * Transaction entity. Pure domain, no framework imports.
 */

export type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  merchant?: string;
  status?: 'posted' | 'pending';
};
