import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserSettingsEntity } from './entities/user-settings.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity, UserSettingsEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
