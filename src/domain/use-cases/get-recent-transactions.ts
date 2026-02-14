import type { Transaction } from '../entities/transaction';
import type { TransactionRepository } from '../repositories/transaction-repository';
import type { Result } from '../../shared/types/result';

export type GetRecentTransactions = (
  repo: TransactionRepository,
  limit?: number
) => Promise<Result<Transaction[]>>;

export function createGetRecentTransactions(): GetRecentTransactions {
  return async (repo, limit = 10) => repo.getRecent(limit);
}
