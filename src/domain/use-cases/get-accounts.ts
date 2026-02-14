import type { Account } from '../entities/account';
import type { AccountRepository } from '../repositories/account-repository';
import type { Result } from '../../shared/types/result';

export type GetAccounts = (repo: AccountRepository) => Promise<Result<Account[]>>;

export function createGetAccounts(): GetAccounts {
  return async (repo) => repo.getAccounts();
}
