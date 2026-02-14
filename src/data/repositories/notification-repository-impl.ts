import type { NotificationRepository } from '../../domain/repositories/notification-repository';
import type { ApiClient } from '../api/api-client';
import { isErr } from '../../shared/types/result';
import { mapNotificationDtoToEntity } from '../mappers/notification-mapper';
import type { NotificationDto } from '../dto/notification-dto';

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
  };
}
