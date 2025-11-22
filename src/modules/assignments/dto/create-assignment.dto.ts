import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  cutOffDate?: string;

  @IsOptional()
  @IsNumber()
  maxGrade?: number;

  @IsOptional()
  @IsString()
  submissionType?: string;

  @IsOptional()
  @IsPositive()
  maxFileSize?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  allowedFileTypes?: string;

  @IsOptional()
  @IsBoolean()
  allowLateSubmission?: boolean;

  @IsOptional()
  @IsBoolean()
  enablePeerReview?: boolean;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  @IsString()
  contentItemId?: string;
}

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {}

