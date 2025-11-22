import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPresignedUrlDto {
  @IsString()
  filename: string;

  @IsString()
  mimeType: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100 * 1024 * 1024) // 100MB max
  @Type(() => Number)
  fileSize?: number;

  @IsOptional()
  @IsString()
  courseId?: string;
}
