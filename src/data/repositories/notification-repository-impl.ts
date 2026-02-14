import type { NotificationRepository } from '../../domain/repositories/notification-repository';
import type { ApiClient } from '../api/api-client';
import { isErr } from '../../shared/types/result';
import { mapNotificationDtoToEntity } from '../mappers/notification-mapper';
import type { NotificationDto } from '../dto/notification-dto';
import type { UnreadCountDto } from '../dto/unread-count-dto';

export function createNotificationRepository(api: ApiClient): NotificationRepository {
  return {
    async getNotifications() {
      const res = await api.get<NotificationDto[]>('/notifications');
      if (isErr(res)) return res;
      return {
        ok: true,
        value: res.value.map(mapNotificationDtoToEntity),
      };
    },
    async getUnreadCount() {
      const res = await api.get<UnreadCountDto>('/notifications/unread-count');
      if (!isErr(res)) return { ok: true as const, value: res.value.count };
      if (res.error.statusCode === 404) {
        const fallback = await api.get<NotificationDto[]>('/notifications');
        if (!isErr(fallback)) {
          const count = fallback.value.filter((n) => !n.read).length;
          return { ok: true as const, value: count };
        }
      }
      return res;
    },
  };
}
