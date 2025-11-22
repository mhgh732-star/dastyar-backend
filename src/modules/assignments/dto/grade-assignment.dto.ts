import { IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class GradeAssignmentDto {
  @IsUUID()
  submissionId: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  grade: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

