import { useQuery } from '@tanstack/react-query';
import { getRepos, getUseCases } from '../../core/di/factory';

const ACCOUNTS_QUERY_KEY = ['accounts'] as const;

export function useAccountsQuery() {
  const { accountRepo } = getRepos();
  const { getAccounts } = getUseCases();

  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: async () => {
      const result = await getAccounts(accountRepo);
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}
