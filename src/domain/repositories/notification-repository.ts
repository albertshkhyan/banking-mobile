import type { Notification } from '../entities/notification';
import type { Result } from '../../shared/types/result';

export type NotificationRepository = {
  getNotifications: () => Promise<Result<Notification[]>>;
};
