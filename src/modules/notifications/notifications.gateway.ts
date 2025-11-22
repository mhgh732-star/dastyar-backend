import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './services/notifications.service';
import { NotificationEntity } from './entities/notification.entity';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub || payload.userId;

      if (!this.userSockets.has(client.userId)) {
        this.userSockets.set(client.userId, new Set());
      }
      this.userSockets.get(client.userId)!.add(client.id);

      // Join user's personal room
      client.join(`user:${client.userId}`);

      // Send unread count on connection
      const unreadCount = await this.notificationsService.getUnreadCount(client.userId);
      client.emit('unread_count', { count: unreadCount });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const sockets = this.userSockets.get(client.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(client.userId);
        }
      }
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { notificationIds: string[] }) {
    if (!client.userId) return;
    await this.notificationsService.markAsRead(data.notificationIds, client.userId);
    const unreadCount = await this.notificationsService.getUnreadCount(client.userId);
    client.emit('unread_count', { count: unreadCount });
  }

  @SubscribeMessage('mark_all_as_read')
  async handleMarkAllAsRead(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.userId) return;
    await this.notificationsService.markAllAsRead(client.userId);
    client.emit('unread_count', { count: 0 });
  }

  // Method to send notification to a specific user
  async sendNotificationToUser(userId: string, notification: NotificationEntity) {
    this.server.to(`user:${userId}`).emit('new_notification', notification);
    const unreadCount = await this.notificationsService.getUnreadCount(userId);
    this.server.to(`user:${userId}`).emit('unread_count', { count: unreadCount });
  }

  // Method to send notification to multiple users
  async sendNotificationToUsers(userIds: string[], notification: NotificationEntity) {
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit('new_notification', notification);
    });
    // Update unread counts for all affected users
    for (const userId of userIds) {
      const unreadCount = await this.notificationsService.getUnreadCount(userId);
      this.server.to(`user:${userId}`).emit('unread_count', { count: unreadCount });
    }
  }

  // Method to broadcast notification to all connected users
  async broadcastNotification(notification: NotificationEntity) {
    this.server.emit('new_notification', notification);
  }
}
