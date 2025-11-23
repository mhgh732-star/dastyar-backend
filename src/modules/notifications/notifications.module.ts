// src/modules/notifications/notifications.module.ts

import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
// ... سایر ایمپورت‌ها
import { JwtModule } from '@nestjs/jwt'; // <--- مطمئن شوید که ایمپورت شده باشد
import { getJwtConfig } from '../../config/jwt.config'; // <--- مطمئن شوید که مسیر صحیح است

@Module({
  imports: [
    // ... سایر TypeOrm.forFeature ها
    // ... سایر ماژول‌ها
    JwtModule.registerAsync({ // <--- مطمئن شوید که این بخش وجود دارد
      useFactory: () => {
        const config = getJwtConfig();
        return {
          secret: config.accessTokenSecret,
          signOptions: { expiresIn: config.accessTokenExpiresIn },
        };
      },
    }),
  ],
  providers: [NotificationsGateway], // ... و سایر Provider ها
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
