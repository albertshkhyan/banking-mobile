import type { Account } from '../entities/account';
import type { AccountsSummary } from '../entities/accounts-summary';
import type { Result } from '../../shared/types/result';

/**
 * Domain interface. Implemented in data layer.
 */
export type AccountRepository = {
  getAccounts: () => Promise<Result<Account[]>>;
  getSummary: () => Promise<Result<AccountsSummary>>;
};
