import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { CreateNotificationDto, UpdateNotificationDto, ListNotificationsDto, MarkAsReadDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('admin', 'teacher', 'student')
  listNotifications(@CurrentUser('userId') userId: string, @Query() query: ListNotificationsDto) {
    return this.notificationsService.listNotifications(userId, query);
  }

  @Get('unread/count')
  @Roles('admin', 'teacher', 'student')
  getUnreadCount(@CurrentUser('userId') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get(':notificationId')
  @Roles('admin', 'teacher', 'student')
  getNotification(@Param('notificationId', new ParseUUIDPipe()) notificationId: string, @CurrentUser('userId') userId: string) {
    return this.notificationsService.getNotification(notificationId, userId);
  }

  @Post()
  @Roles('admin', 'teacher')
  createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Patch(':notificationId')
  @Roles('admin', 'teacher', 'student')
  updateNotification(
    @Param('notificationId', new ParseUUIDPipe()) notificationId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.updateNotification(notificationId, userId, dto);
  }

  @Post('mark-as-read')
  @Roles('admin', 'teacher', 'student')
  markAsRead(@CurrentUser('userId') userId: string, @Body() dto: MarkAsReadDto) {
    return this.notificationsService.markAsRead(dto.notificationIds, userId);
  }

  @Post('mark-all-as-read')
  @Roles('admin', 'teacher', 'student')
  markAllAsRead(@CurrentUser('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':notificationId')
  @Roles('admin', 'teacher', 'student')
  deleteNotification(@Param('notificationId', new ParseUUIDPipe()) notificationId: string, @CurrentUser('userId') userId: string) {
    return this.notificationsService.deleteNotification(notificationId, userId);
  }

  @Delete('read/all')
  @Roles('admin', 'teacher', 'student')
  deleteAllRead(@CurrentUser('userId') userId: string) {
    return this.notificationsService.deleteAllRead(userId);
  }
}

