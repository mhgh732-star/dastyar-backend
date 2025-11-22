import { IsUUID, IsString, IsOptional, IsBoolean, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateForumDto {
  @IsUUID()
  courseId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['general', 'announcement', 'qna', 'group'])
  forumType?: 'general' | 'announcement' | 'qna' | 'group';

  @IsOptional()
  @IsBoolean()
  isModerated?: boolean;

  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;
}

export class UpdateForumDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isModerated?: boolean;

  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;
}

export class CreateTopicDto {
  @IsUUID()
  forumId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class CreatePostDto {
  @IsUUID()
  topicId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class UpdatePostDto {
  @IsString()
  content: string;
}

export class ListTopicsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsEnum(['createdAt', 'views', 'replies', 'lastPostAt'])
  sortBy?: 'createdAt' | 'views' | 'replies' | 'lastPostAt';

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPinned?: boolean;
}
