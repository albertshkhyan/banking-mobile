import type { User } from '../entities/user';
import type { Result } from '../../shared/types/result';

export type LoginParams = { email: string; password: string };
export type RegisterParams = { name: string; email: string; password: string };

/**
 * Domain interface. Implemented in data layer.
 * refresh() used by api-client on 401 and optionally on app resume.
 */
export type AuthRepository = {
  login: (params: LoginParams) => Promise<Result<User>>;
  register: (params: RegisterParams) => Promise<Result<User>>;
  refresh: () => Promise<Result<void>>;
  logout: () => Promise<void>;
};
