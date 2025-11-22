import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadContentFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  size: number;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
