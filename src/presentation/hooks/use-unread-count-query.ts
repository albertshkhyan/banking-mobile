import { useQuery } from '@tanstack/react-query';
import { getRepos } from '../../core/di/factory';

const UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread-count'] as const;

export function useUnreadCountQuery() {
  const { notificationRepo } = getRepos();

  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: async () => {
      const result = await notificationRepo.getUnreadCount();
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}
