import type { Notification } from '../entities/notification';
import type { NotificationRepository } from '../repositories/notification-repository';
import type { Result } from '../../shared/types/result';

export type GetNotifications = (
  repo: NotificationRepository
) => Promise<Result<Notification[]>>;

export function createGetNotifications(): GetNotifications {
  return async (repo) => repo.getNotifications();
}
