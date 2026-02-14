import type { Transaction } from '../entities/transaction';
import type { Result } from '../../shared/types/result';

export type TransactionRepository = {
  getRecent: (limit?: number) => Promise<Result<Transaction[]>>;
};
