import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './question.dto';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsUUID()
  contentItemId?: string;

  @IsOptional()
  @IsPositive()
  timeLimit?: number;

  @IsOptional()
  @IsPositive()
  attemptsAllowed?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  passingGrade?: number;

  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  shuffleAnswers?: boolean;

  @IsOptional()
  @IsBoolean()
  showCorrectAnswers?: boolean;

  @IsOptional()
  @IsDateString()
  openDate?: string;

  @IsOptional()
  @IsDateString()
  closeDate?: string;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}
