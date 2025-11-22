import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EnrollUserDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(['student', 'teacher', 'assistant'], { message: 'Invalid course role' })
  roleInCourse?: 'student' | 'teacher' | 'assistant';
}
