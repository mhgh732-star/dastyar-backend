import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { MessageEntity } from './entities/message.entity';
import { MessageReadEntity } from './entities/message-read.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { getJwtConfig } from '../../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoomEntity, MessageEntity, MessageReadEntity, UserEntity, CourseEntity]),
    JwtModule.registerAsync({
      useFactory: () => {
        const config = getJwtConfig();
        return {
          secret: config.accessTokenSecret,
          signOptions: { expiresIn: config.accessTokenExpiresIn },
        };
      },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
