import { useQuery } from '@tanstack/react-query';
import { getRepos } from '../../core/di/factory';

const ACCOUNTS_SUMMARY_QUERY_KEY = ['accounts', 'summary'] as const;

export function useAccountsSummaryQuery() {
  const { accountRepo } = getRepos();

  return useQuery({
    queryKey: ACCOUNTS_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const result = await accountRepo.getSummary();
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}
