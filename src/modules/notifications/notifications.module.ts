import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationEntity } from './entities/notification.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { getJwtConfig } from '../../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, UserEntity]),
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
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
