import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './services/file-manager.service';
import { StorageService } from './services/storage.service';
import { FileEntity } from './entities/file.entity';
import { StorageLocationEntity } from './entities/storage-location.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, StorageLocationEntity, CourseEntity, UserEntity]),
  ],
  controllers: [FileManagerController],
  providers: [FileManagerService, StorageService],
  exports: [FileManagerService, StorageService],
})
export class FileManagerModule {}
