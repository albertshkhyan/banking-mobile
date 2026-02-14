import { useQuery } from '@tanstack/react-query';
import { getRepos, getUseCases } from '../../core/di/factory';

const TRANSACTIONS_QUERY_KEY = ['transactions', 'recent'] as const;

export function useRecentTransactionsQuery(limit?: number) {
  const { transactionRepo } = getRepos();
  const { getRecentTransactions } = getUseCases();

  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, limit],
    queryFn: async () => {
      const result = await getRecentTransactions(transactionRepo, limit);
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}
