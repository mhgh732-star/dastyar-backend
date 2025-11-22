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
import { ChatService } from './services/chat.service';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/chat.dto';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();
  private roomSockets: Map<string, Set<string>> = new Map();

  constructor(
    private readonly chatService: ChatService,
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

      // Remove from all rooms
      this.roomSockets.forEach((sockets, roomId) => {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.roomSockets.delete(roomId);
        }
      });
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomId: string }) {
    if (!client.userId) return;

    try {
      // Verify user has access to room
      await this.chatService.getRoom(data.roomId, client.userId);

      client.join(`room:${data.roomId}`);

      if (!this.roomSockets.has(data.roomId)) {
        this.roomSockets.set(data.roomId, new Set());
      }
      this.roomSockets.get(data.roomId)!.add(client.id);

      // Notify others in room
      client.to(`room:${data.roomId}`).emit('user_joined', {
        userId: client.userId,
        roomId: data.roomId,
      });

      return { success: true, roomId: data.roomId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomId: string }) {
    if (!client.userId) return;

    client.leave(`room:${data.roomId}`);

    const sockets = this.roomSockets.get(data.roomId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.roomSockets.delete(data.roomId);
      }
    }

    client.to(`room:${data.roomId}`).emit('user_left', {
      userId: client.userId,
      roomId: data.roomId,
    });

    return { success: true, roomId: data.roomId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: CreateMessageDto & { roomId: string }) {
    if (!client.userId) return;

    try {
      const message = await this.chatService.createMessage(data.roomId, data, client.userId);

      // Broadcast to all users in the room
      this.server.to(`room:${data.roomId}`).emit('new_message', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomId: string }) {
    if (!client.userId) return;

    client.to(`room:${data.roomId}`).emit('user_typing', {
      userId: client.userId,
      roomId: data.roomId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomId: string }) {
    if (!client.userId) return;

    client.to(`room:${data.roomId}`).emit('user_typing', {
      userId: client.userId,
      roomId: data.roomId,
      isTyping: false,
    });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { messageId: string }) {
    if (!client.userId) return;

    try {
      await this.chatService.markAsRead(data.messageId, client.userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Method to broadcast message to room (can be called from service)
  async broadcastMessage(roomId: string, message: MessageEntity) {
    this.server.to(`room:${roomId}`).emit('new_message', message);
  }

  // Method to notify room update
  async notifyRoomUpdate(roomId: string, update: any) {
    this.server.to(`room:${roomId}`).emit('room_updated', update);
  }
}
