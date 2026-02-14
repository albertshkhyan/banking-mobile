import { useQuery } from '@tanstack/react-query';
import { getRepos, getUseCases } from '../../core/di/factory';

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

export function useNotificationsQuery() {
  const { notificationRepo } = getRepos();
  const { getNotifications } = getUseCases();

  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const result = await getNotifications(notificationRepo);
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}
