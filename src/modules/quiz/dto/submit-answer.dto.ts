import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class AnswerPayloadDto {
  @IsUUID()
  questionId: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  choiceIds?: string[];

  @IsOptional()
  @IsString()
  value?: string;
}

export class SubmitAnswerDto {
  @IsUUID()
  attemptId: string;

  @IsArray()
  answers: AnswerPayloadDto[];
}
