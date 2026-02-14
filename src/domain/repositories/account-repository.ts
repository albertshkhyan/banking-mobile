import type { Account } from '../entities/account';
import type { Result } from '../../shared/types/result';

/**
 * Domain interface. Implemented in data layer.
 */
export type AccountRepository = {
  getAccounts: () => Promise<Result<Account[]>>;
};
