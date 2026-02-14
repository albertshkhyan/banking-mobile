import { createApiClient } from '../../data/api/api-client';
import { createTokenStorage } from '../../data/auth/token-storage';
import { createAccountRepository } from '../../data/repositories/account-repository-impl';
import { createAuthRepository } from '../../data/repositories/auth-repository-impl';
import { createBiometricRepository } from '../../data/repositories/biometric-repository-impl';
import { createTransactionRepository } from '../../data/repositories/transaction-repository-impl';
import { createNotificationRepository } from '../../data/repositories/notification-repository-impl';
import { createGetAccounts } from '../../domain/use-cases/get-accounts';
import { createGetRecentTransactions } from '../../domain/use-cases/get-recent-transactions';
import { createGetNotifications } from '../../domain/use-cases/get-notifications';
import { createBiometricLogin } from '../../domain/use-cases/biometric-login';
import type { AuthRepository } from '../../domain/repositories/auth-repository';
import { isErr } from '../../shared/types/result';
import { env } from '../../shared/config/env';

let apiInstance: ReturnType<typeof createApiClient>;

function createRepos() {
  const tokenStorage = createTokenStorage();
  let authRepo: AuthRepository;
  const performRefresh = async () => authRepo.refresh();
  apiInstance = createApiClient({
    baseURL: env.apiUrl,
    tokenStorage,
    performRefresh,
  });
  authRepo = createAuthRepository(apiInstance, tokenStorage);
  return {
    accountRepo: createAccountRepository(apiInstance),
    authRepo,
    biometricRepo: createBiometricRepository(),
    transactionRepo: createTransactionRepository(apiInstance),
    notificationRepo: createNotificationRepository(apiInstance),
  };
}

function createUseCases() {
  return {
    getAccounts: createGetAccounts(),
    getRecentTransactions: createGetRecentTransactions(),
    getNotifications: createGetNotifications(),
    biometricLogin: createBiometricLogin(),
  };
}

const reposInstance = createRepos();
const useCasesInstance = createUseCases();

/** Singleton repos for injection into hooks. Only core/di wires concrete implementations. */
export function getRepos() {
  return reposInstance;
}

/** Singleton use cases for injection into hooks. */
export function getUseCases() {
  return useCasesInstance;
}

/** Auth gate: uses shared api client (with stored tokens). True if GET /auth/me returns 2xx. */
export async function getAuthStatus(): Promise<boolean> {
  const res = await apiInstance.get<{ user: unknown }>('/auth/me');
  return !isErr(res);
}
