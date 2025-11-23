// src/modules/notifications/notifications.gateway.ts

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
// احتمالاً NotificationService
// import { NotificationsService } from './notifications.service'; 
import { Socket } from 'socket.io'; // <--- اصلاح ۱: ایمپورت Socket از socket.io
import { JwtService } from '@nestjs/jwt'; // <--- اصلاح ۲: ایمپورت JwtService

// تعریف نوع AuthenticatedSocket (همان تعریف ماژول چت)
interface JwtPayload {
  id: number;
}

export interface AuthenticatedSocket extends Socket { // <--- اصلاح ۳: extends Socket
  user: JwtPayload;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // private readonly notificationsService: NotificationsService, 
    private readonly jwtService: JwtService,
  ) {}

  // **منطق اتصال (برای احراز هویت)**
  async handleConnection(socket: AuthenticatedSocket) {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers['token'];

      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      socket.user = { id: payload.sub };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    // ... (منطق قطع اتصال)
  }

  // @SubscribeMessage و سایر منطق گیت‌وی خود را اینجا قرار دهید.
  // ...
}
