import { IsUUID, IsOptional, IsString, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class TrackCompletionDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  contentItemId?: string;

  @IsOptional()
  @IsEnum(['view', 'time_spent', 'quiz_passed', 'assignment_submitted', 'manual'])
  completionType?: 'view' | 'time_spent' | 'quiz_passed' | 'assignment_submitted' | 'manual';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  progressPercentage?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetProgressDto {
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
