import type { Transaction } from '../../../domain/entities/transaction';

export function formatAmount(t: Transaction): string {
  const sign = t.type === 'credit' ? '+' : '';
  return `${sign}$${Math.abs(t.amount).toFixed(2)}`;
}
