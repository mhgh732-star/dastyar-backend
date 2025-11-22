import { IsString, IsOptional, IsEnum, IsBoolean, IsObject, IsUUID, IsUrl, Min, Max } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(['info', 'success', 'warning', 'error', 'assignment', 'quiz', 'forum', 'grade', 'announcement'])
  @IsOptional()
  type?: NotificationType;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  actionLabel?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  read?: boolean;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  message?: string;
}

export class ListNotificationsDto {
  @IsOptional()
  @Min(1)
  page?: number;

  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsEnum(['info', 'success', 'warning', 'error', 'assignment', 'quiz', 'forum', 'grade', 'announcement'])
  type?: NotificationType;
}

export class MarkAsReadDto {
  @IsUUID('4', { each: true })
  notificationIds: string[];
}
