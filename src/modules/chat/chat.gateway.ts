import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './services/chat.service';
import { Socket } from 'socket.io'; 
import { JwtService } from '@nestjs/jwt';

// تعریف نوع AuthenticatedSocket
interface JwtPayload {
  id: number;
}

export interface AuthenticatedSocket extends Socket { // <--- اصلاح: extends Socket
  user: JwtPayload;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

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
  
  // ... سایر توابع
}
