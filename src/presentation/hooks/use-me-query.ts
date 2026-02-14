import { useQuery } from '@tanstack/react-query';
import { getRepos } from '../../core/di/factory';

const ME_QUERY_KEY = ['me'] as const;

export function useMeQuery() {
  const { authRepo } = getRepos();

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const result = await authRepo.getMe();
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}
