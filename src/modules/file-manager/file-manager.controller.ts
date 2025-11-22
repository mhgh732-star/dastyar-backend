import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileManagerService } from './services/file-manager.service';
import { StorageLocationEntity } from './entities/storage-location.entity';
import { UploadFileDto, UpdateFileDto, ListFilesDto, CreateStorageLocationDto, UpdateStorageLocationDto } from './dto/file.dto';
import { GetPresignedUrlDto } from './dto/upload-presign.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class FileManagerController {
  constructor(
    private readonly fileManagerService: FileManagerService,
    @InjectRepository(StorageLocationEntity) private readonly storageRepo: Repository<StorageLocationEntity>,
  ) {}

  @Get()
  @Roles('admin', 'teacher', 'student')
  listFiles(@Query() query: ListFilesDto, @CurrentUser('userId') userId?: string) {
    return this.fileManagerService.listFiles(query, userId);
  }

  @Get(':fileId')
  @Roles('admin', 'teacher', 'student')
  getFile(@Param('fileId', new ParseUUIDPipe()) fileId: string) {
    return this.fileManagerService.getFile(fileId);
  }

  @Get(':fileId/url')
  @Roles('admin', 'teacher', 'student')
  getFileUrl(@Param('fileId', new ParseUUIDPipe()) fileId: string) {
    return this.fileManagerService.getFileUrl(fileId);
  }

  @Post('upload')
  @Roles('admin', 'teacher', 'student')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: { originalname: string; mimetype: string; size: number; buffer: Buffer } | undefined,
    @Body() dto: UploadFileDto,
    @CurrentUser('userId') userId: string,
  ) {
    if (!file) throw new Error('No file uploaded');
    return this.fileManagerService.createFile(file, dto, userId);
  }

  @Patch(':fileId')
  @Roles('admin', 'teacher', 'student')
  updateFile(@Param('fileId', new ParseUUIDPipe()) fileId: string, @Body() dto: UpdateFileDto) {
    return this.fileManagerService.updateFile(fileId, dto);
  }

  @Delete(':fileId')
  @Roles('admin', 'teacher', 'student')
  deleteFile(@Param('fileId', new ParseUUIDPipe()) fileId: string) {
    return this.fileManagerService.deleteFile(fileId);
  }

  @Post('presign')
  @Roles('admin', 'teacher', 'student')
  getPresignedUrl(@Body() dto: GetPresignedUrlDto, @CurrentUser('userId') userId: string) {
    return this.fileManagerService.getPresignedUpload(dto, userId);
  }

  @Get('storage/locations')
  @Roles('admin')
  listStorageLocations() {
    return this.storageRepo.find({ order: { isDefault: 'DESC', createdAt: 'ASC' } });
  }

  @Post('storage/locations')
  @Roles('admin')
  createStorageLocation(@Body() dto: CreateStorageLocationDto) {
    const location = this.storageRepo.create(dto);
    return this.storageRepo.save(location);
  }

  @Patch('storage/locations/:locationId')
  @Roles('admin')
  updateStorageLocation(@Param('locationId', new ParseUUIDPipe()) locationId: string, @Body() dto: UpdateStorageLocationDto) {
    return this.storageRepo.update(locationId, dto);
  }
}
