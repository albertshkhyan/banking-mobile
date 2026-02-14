import type { Notification } from '../../domain/entities/notification';
import type { NotificationDto } from '../dto/notification-dto';

export function mapNotificationDtoToEntity(dto: NotificationDto): Notification {
  return {
    id: dto.id,
    title: dto.title,
    body: dto.body,
    read: dto.read,
    createdAt: dto.createdAt,
  };
}
