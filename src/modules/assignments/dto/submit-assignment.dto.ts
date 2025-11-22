import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmitAssignmentDto {
  @IsUUID()
  assignmentId: string;

  @IsOptional()
  @IsString()
  submissionText?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}

