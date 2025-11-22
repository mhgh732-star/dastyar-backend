import { IsUUID, IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGradeDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  gradeItemId?: string;

  @IsOptional()
  @IsString()
  gradeItemType?: 'quiz' | 'assignment' | 'manual';

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  grade: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxGrade?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsBoolean()
  isExcused?: boolean;

  @IsOptional()
  @IsBoolean()
  isDropped?: boolean;
}

export class UpdateGradeDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  grade?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxGrade?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsBoolean()
  isExcused?: boolean;

  @IsOptional()
  @IsBoolean()
  isDropped?: boolean;
}

export class CreateGradeCategoryDto {
  @IsUUID()
  courseId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsString()
  aggregationMethod?: 'mean' | 'weighted_mean' | 'sum' | 'max' | 'min' | 'median';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dropLowest?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dropHighest?: number;
}

export class UpdateGradeCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsString()
  aggregationMethod?: 'mean' | 'weighted_mean' | 'sum' | 'max' | 'min' | 'median';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dropLowest?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dropHighest?: number;
}

export class ExportGradesDto {
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  format?: 'csv' | 'xlsx' | 'json';
}
