import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  sectionOrder?: number;
}
