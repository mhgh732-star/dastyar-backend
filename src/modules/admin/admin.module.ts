import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './admin.service';
import { SettingsService } from './services/settings.service';
import { AuditService } from './services/audit.service';
import { SystemSettingEntity } from './entities/system-setting.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { CourseEnrollmentEntity } from '../courses/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSettingEntity, AuditLogEntity, UserEntity, CourseEntity, CourseEnrollmentEntity])],
  controllers: [AdminController],
  providers: [AdminService, SettingsService, AuditService],
  exports: [AdminService],
})
export class AdminModule {}
