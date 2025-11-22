import { IsUUID, IsString, IsOptional, IsBoolean, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadFileDto {
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class ListFilesDto {
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsEnum(['document', 'image', 'video', 'audio', 'archive', 'other'])
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

export class CreateStorageLocationDto {
  @IsString()
  name: string;

  @IsEnum(['local', 's3', 'azure', 'gcs'])
  provider: 'local' | 's3' | 'azure' | 'gcs';

  @IsString()
  basePath: string;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  bucket?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateStorageLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  basePath?: string;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  bucket?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
