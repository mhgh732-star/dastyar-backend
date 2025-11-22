import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity, NotificationType } from '../entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto, ListNotificationsDto, MarkAsReadDto } from '../dto/notification.dto';
import { UserEntity } from '../../auth/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity) private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepo.create({
      ...dto,
      type: dto.type ?? 'info',
    });

    return this.notificationRepo.save(notification);
  }

  async createBulkNotifications(userIds: string[], title: string, message: string, type: NotificationType = 'info', link?: string, metadata?: Record<string, any>) {
    const notifications = userIds.map((userId) =>
      this.notificationRepo.create({
        userId,
        title,
        message,
        type,
        link,
        metadata,
      }),
    );

    return this.notificationRepo.save(notifications);
  }

  async listNotifications(userId: string, query: ListNotificationsDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (query.read !== undefined) {
      qb.andWhere('notification.read = :read', { read: query.read });
    }

    if (query.type) {
      qb.andWhere('notification.type = :type', { type: query.type });
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      items,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getNotification(id: string, userId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async updateNotification(id: string, userId: string, dto: UpdateNotificationDto) {
    const notification = await this.getNotification(id, userId);

    if (dto.read === true && !notification.read) {
      notification.readAt = new Date();
    } else if (dto.read === false) {
      notification.readAt = null;
    }

    Object.assign(notification, dto);
    return this.notificationRepo.save(notification);
  }

  async markAsRead(notificationIds: string[], userId: string) {
    if (notificationIds.length === 0) {
      throw new BadRequestException('At least one notification ID is required');
    }

    const result = await this.notificationRepo
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ read: true, readAt: new Date() })
      .where('id IN (:...ids)', { ids: notificationIds })
      .andWhere('userId = :userId', { userId })
      .execute();

    return { success: true, affected: result.affected ?? 0 };
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ read: true, readAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('read = :read', { read: false })
      .execute();

    return { success: true, affected: result.affected ?? 0 };
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await this.getNotification(id, userId);
    await this.notificationRepo.remove(notification);
    return { success: true };
  }

  async deleteAllRead(userId: string) {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .delete()
      .from(NotificationEntity)
      .where('userId = :userId', { userId })
      .andWhere('read = :read', { read: true })
      .execute();

    return { success: true, affected: result.affected ?? 0 };
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepo.count({
      where: { userId, read: false },
    });
  }
}
