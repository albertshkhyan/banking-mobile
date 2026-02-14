import { createApiClient } from '../../data/api/api-client';
import { createAccountRepository } from '../../data/repositories/account-repository-impl';
import { createTransactionRepository } from '../../data/repositories/transaction-repository-impl';
import { createNotificationRepository } from '../../data/repositories/notification-repository-impl';
import { createGetAccounts } from '../../domain/use-cases/get-accounts';
import { createGetRecentTransactions } from '../../domain/use-cases/get-recent-transactions';
import { createGetNotifications } from '../../domain/use-cases/get-notifications';
import { env } from '../../shared/config/env';

function createRepos() {
  const api = createApiClient(env.apiUrl);
  return {
    accountRepo: createAccountRepository(api),
    transactionRepo: createTransactionRepository(api),
    notificationRepo: createNotificationRepository(api),
  };
}

function createUseCases() {
  return {
    getAccounts: createGetAccounts(),
    getRecentTransactions: createGetRecentTransactions(),
    getNotifications: createGetNotifications(),
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
