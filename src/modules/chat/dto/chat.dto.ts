import { IsString, IsOptional, IsEnum, IsBoolean, IsObject, IsUUID, IsArray, Min, Max, IsNumber } from 'class-validator';
import { ChatRoomType } from '../entities/chat-room.entity';
import { MessageType } from '../entities/message.entity';

export class CreateChatRoomDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['course', 'private', 'group'])
  @IsOptional()
  type?: ChatRoomType;

  @IsUUID()
  @IsOptional()
  courseId?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  participantIds?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateChatRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class AddParticipantsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class RemoveParticipantsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(['text', 'file', 'image', 'system'])
  @IsOptional()
  type?: MessageType;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsUUID()
  @IsOptional()
  replyToId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateMessageDto {
  @IsString()
  content: string;
}

export class ListMessagesDto {
  @IsOptional()
  @Min(1)
  page?: number;

  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsUUID()
  @IsOptional()
  beforeMessageId?: string;
}

export class ListChatRoomsDto {
  @IsOptional()
  @Min(1)
  page?: number;

  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsEnum(['course', 'private', 'group'])
  @IsOptional()
  type?: ChatRoomType;

  @IsUUID()
  @IsOptional()
  courseId?: string;
}

