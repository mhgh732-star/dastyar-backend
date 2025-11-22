import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './services/chat.service';
import {
  CreateChatRoomDto,
  UpdateChatRoomDto,
  AddParticipantsDto,
  RemoveParticipantsDto,
  CreateMessageDto,
  UpdateMessageDto,
  ListMessagesDto,
  ListChatRoomsDto,
} from './dto/chat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Chat Room Endpoints
  @Post('rooms')
  @Roles('admin', 'teacher', 'student')
  createRoom(@Body() dto: CreateChatRoomDto, @CurrentUser('userId') userId: string) {
    return this.chatService.createRoom(dto, userId);
  }

  @Get('rooms')
  @Roles('admin', 'teacher', 'student')
  listRooms(@CurrentUser('userId') userId: string, @Query() query: ListChatRoomsDto) {
    return this.chatService.listRooms(userId, query);
  }

  @Get('rooms/:roomId')
  @Roles('admin', 'teacher', 'student')
  getRoom(@Param('roomId', new ParseUUIDPipe()) roomId: string, @CurrentUser('userId') userId: string) {
    return this.chatService.getRoom(roomId, userId);
  }

  @Patch('rooms/:roomId')
  @Roles('admin', 'teacher', 'student')
  updateRoom(
    @Param('roomId', new ParseUUIDPipe()) roomId: string,
    @Body() dto: UpdateChatRoomDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.chatService.updateRoom(roomId, dto, userId);
  }

  @Delete('rooms/:roomId')
  @Roles('admin', 'teacher', 'student')
  deleteRoom(@Param('roomId', new ParseUUIDPipe()) roomId: string, @CurrentUser('userId') userId: string) {
    return this.chatService.deleteRoom(roomId, userId);
  }

  @Post('rooms/:roomId/participants')
  @Roles('admin', 'teacher', 'student')
  addParticipants(
    @Param('roomId', new ParseUUIDPipe()) roomId: string,
    @Body() dto: AddParticipantsDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.chatService.addParticipants(roomId, dto, userId);
  }

  @Delete('rooms/:roomId/participants')
  @Roles('admin', 'teacher', 'student')
  removeParticipants(
    @Param('roomId', new ParseUUIDPipe()) roomId: string,
    @Body() dto: RemoveParticipantsDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.chatService.removeParticipants(roomId, dto, userId);
  }

  // Message Endpoints
  @Post('rooms/:roomId/messages')
  @Roles('admin', 'teacher', 'student')
  createMessage(
    @Param('roomId', new ParseUUIDPipe()) roomId: string,
    @Body() dto: CreateMessageDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.chatService.createMessage(roomId, dto, userId);
  }

  @Get('rooms/:roomId/messages')
  @Roles('admin', 'teacher', 'student')
  listMessages(
    @Param('roomId', new ParseUUIDPipe()) roomId: string,
    @CurrentUser('userId') userId: string,
    @Query() query: ListMessagesDto,
  ) {
    return this.chatService.listMessages(roomId, userId, query);
  }

  @Get('messages/:messageId')
  @Roles('admin', 'teacher', 'student')
  getMessage(@Param('messageId', new ParseUUIDPipe()) messageId: string, @CurrentUser('userId') userId: string) {
    return this.chatService.getMessage(messageId, userId);
  }

  @Patch('messages/:messageId')
  @Roles('admin', 'teacher', 'student')
  updateMessage(
    @Param('messageId', new ParseUUIDPipe()) messageId: string,
    @Body() dto: UpdateMessageDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.chatService.updateMessage(messageId, dto, userId);
  }

  @Delete('messages/:messageId')
  @Roles('admin', 'teacher', 'student')
  deleteMessage(@Param('messageId', new ParseUUIDPipe()) messageId: string, @CurrentUser('userId') userId: string) {
    return this.chatService.deleteMessage(messageId, userId);
  }

  @Post('messages/:messageId/read')
  @Roles('admin', 'teacher', 'student')
  markAsRead(@Param('messageId', new ParseUUIDPipe()) messageId: string, @CurrentUser('userId') userId: string) {
    return this.chatService.markAsRead(messageId, userId);
  }

  @Get('rooms/:roomId/unread-count')
  @Roles('admin', 'teacher', 'student')
  getUnreadCount(@Param('roomId', new ParseUUIDPipe()) roomId: string, @CurrentUser('userId') userId: string) {
    return this.chatService.getUnreadCount(roomId, userId);
  }
}

