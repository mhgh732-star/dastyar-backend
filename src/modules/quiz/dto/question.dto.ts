import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class QuestionChoiceDto {
  @IsString()
  optionText: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @IsOptional()
  @IsNumber()
  optionOrder?: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class CreateQuestionDto {
  @IsString()
  questionType: string;

  @IsString()
  questionText: string;

  @IsOptional()
  @IsString()
  questionHtml?: string;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsPositive()
  questionOrder?: number;

  @IsOptional()
  settings?: Record<string, any>;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionChoiceDto)
  choices: QuestionChoiceDto[];
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
