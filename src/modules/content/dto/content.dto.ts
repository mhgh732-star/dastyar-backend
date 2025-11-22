import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export const CONTENT_TYPES = ['page', 'video', 'file', 'embed', 'assignment', 'quiz'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export class CreateContentDto {
  @IsOptional()
  @IsUUID()
  sectionId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  contentType: ContentType;

  @IsOptional()
  @IsString()
  contentBody?: string;

  @IsOptional()
  @IsString()
  resourceUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  itemOrder?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class UpdateContentDto extends PartialType(CreateContentDto) {}

export class ReorderItemDto {
  @IsUUID()
  id: string;

  @IsInt()
  order: number;
}

export class ReorderContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
