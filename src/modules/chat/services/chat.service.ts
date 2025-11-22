import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ChatRoomEntity, ChatRoomType } from '../entities/chat-room.entity';
import { MessageEntity, MessageType } from '../entities/message.entity';
import { MessageReadEntity } from '../entities/message-read.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import {
  CreateChatRoomDto,
  UpdateChatRoomDto,
  AddParticipantsDto,
  RemoveParticipantsDto,
  CreateMessageDto,
  UpdateMessageDto,
  ListMessagesDto,
  ListChatRoomsDto,
} from '../dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomEntity) private readonly roomRepo: Repository<ChatRoomEntity>,
    @InjectRepository(MessageEntity) private readonly messageRepo: Repository<MessageEntity>,
    @InjectRepository(MessageReadEntity) private readonly messageReadRepo: Repository<MessageReadEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
  ) {}

  // Chat Room Methods
  async createRoom(dto: CreateChatRoomDto, createdById: string) {
    if (dto.courseId) {
      const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    const room = this.roomRepo.create({
      ...dto,
      createdById,
      type: dto.type ?? (dto.courseId ? 'course' : 'group'),
      isPrivate: dto.isPrivate ?? false,
    });

    const savedRoom = await this.roomRepo.save(room);

    // Add participants
    if (dto.participantIds && dto.participantIds.length > 0) {
      await this.addParticipants(savedRoom.id, { userIds: dto.participantIds }, createdById);
    } else {
      // Add creator as participant
      await this.addParticipants(savedRoom.id, { userIds: [createdById] }, createdById);
    }

    return this.getRoom(savedRoom.id, createdById);
  }

  async listRooms(userId: string, query: ListChatRoomsDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.roomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.createdBy', 'createdBy')
      .leftJoinAndSelect('room.participants', 'participants')
      .leftJoin('room.participants', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('room.isArchived = :isArchived', { isArchived: false });

    if (query.type) {
      qb.andWhere('room.type = :type', { type: query.type });
    }

    if (query.courseId) {
      qb.andWhere('room.courseId = :courseId', { courseId: query.courseId });
    }

    const [items, total] = await qb
      .orderBy('room.updatedAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRoom(roomId: string, userId: string) {
    const room = await this.roomRepo.findOne({
      where: { id: roomId },
      relations: ['createdBy', 'participants', 'course'],
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    // Check if user is participant
    const isParticipant = room.participants?.some((p) => p.id === userId);
    if (room.isPrivate && !isParticipant) {
      throw new ForbiddenException('You do not have access to this room');
    }

    return room;
  }

  async updateRoom(roomId: string, dto: UpdateChatRoomDto, userId: string) {
    const room = await this.getRoom(roomId, userId);

    // Check if user is creator or has permission
    if (room.createdById !== userId) {
      throw new ForbiddenException('Only room creator can update the room');
    }

    Object.assign(room, dto);
    return this.roomRepo.save(room);
  }

  async deleteRoom(roomId: string, userId: string) {
    const room = await this.getRoom(roomId, userId);

    if (room.createdById !== userId) {
      throw new ForbiddenException('Only room creator can delete the room');
    }

    await this.roomRepo.remove(room);
    return { success: true };
  }

  async addParticipants(roomId: string, dto: AddParticipantsDto, userId: string) {
    const room = await this.getRoom(roomId, userId);

    if (room.isPrivate && room.createdById !== userId) {
      throw new ForbiddenException('Only room creator can add participants');
    }

    const users = await this.userRepo.findBy({ id: In(dto.userIds) });
    if (users.length !== dto.userIds.length) {
      throw new NotFoundException('Some users not found');
    }

    room.participants = [...(room.participants || []), ...users];
    return this.roomRepo.save(room);
  }

  async removeParticipants(roomId: string, dto: RemoveParticipantsDto, userId: string) {
    const room = await this.getRoom(roomId, userId);

    if (room.createdById !== userId) {
      throw new ForbiddenException('Only room creator can remove participants');
    }

    room.participants = room.participants?.filter((p) => !dto.userIds.includes(p.id)) || [];
    return this.roomRepo.save(room);
  }

  // Message Methods
  async createMessage(roomId: string, dto: CreateMessageDto, senderId: string) {
    const room = await this.getRoom(roomId, senderId);

    // Check if user is participant
    const isParticipant = room.participants?.some((p) => p.id === senderId);
    if (room.isPrivate && !isParticipant) {
      throw new ForbiddenException('You are not a participant in this room');
    }

    const message = this.messageRepo.create({
      ...dto,
      roomId,
      senderId,
      type: dto.type ?? 'text',
    });

    if (dto.replyToId) {
      const replyTo = await this.messageRepo.findOne({ where: { id: dto.replyToId, roomId } });
      if (!replyTo) {
        throw new NotFoundException('Reply message not found');
      }
      message.replyTo = replyTo;
    }

    const savedMessage = await this.messageRepo.save(message);
    
    // Update room's updatedAt
    room.updatedAt = new Date();
    await this.roomRepo.save(room);

    // Return message with relations
    return this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'replyTo', 'room'],
    }) || savedMessage;
  }

  async listMessages(roomId: string, userId: string, query: ListMessagesDto = {}) {
    await this.getRoom(roomId, userId); // Verify access

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    let qb = this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.replyTo', 'replyTo')
      .where('message.roomId = :roomId', { roomId })
      .andWhere('message.isDeleted = :isDeleted', { isDeleted: false });

    if (query.beforeMessageId) {
      const beforeMessage = await this.messageRepo.findOne({ where: { id: query.beforeMessageId } });
      if (beforeMessage) {
        qb.andWhere('message.createdAt < :beforeDate', { beforeDate: beforeMessage.createdAt });
      }
    }

    const [items, total] = await qb.orderBy('message.createdAt', 'DESC').skip(skip).take(limit).getManyAndCount();

    // Mark messages as read for this user
    const messageIds = items.map((msg) => msg.id);
    if (messageIds.length > 0) {
      const existingReads = await this.messageReadRepo.find({
        where: { messageId: In(messageIds), userId },
      });
      const existingMessageIds = new Set(existingReads.map((r) => r.messageId));
      const unreadMessageIds = messageIds.filter((id) => !existingMessageIds.has(id));

      if (unreadMessageIds.length > 0) {
        const reads = unreadMessageIds.map((messageId) =>
          this.messageReadRepo.create({
            messageId,
            userId,
          }),
        );
        await this.messageReadRepo.save(reads);
      }
    }

    return {
      items: items.reverse(), // Return in chronological order
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMessage(messageId: string, userId: string) {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
      relations: ['sender', 'replyTo', 'room', 'reads'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.getRoom(message.roomId, userId); // Verify access

    return message;
  }

  async updateMessage(messageId: string, dto: UpdateMessageDto, userId: string) {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
      relations: ['room'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    if (message.isDeleted) {
      throw new BadRequestException('Cannot edit deleted message');
    }

    message.content = dto.content;
    message.isEdited = true;
    return this.messageRepo.save(message);
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
      relations: ['room'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    message.isDeleted = true;
    message.content = '[Message deleted]';
    return this.messageRepo.save(message);
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.getRoom(message.roomId, userId); // Verify access

    const existing = await this.messageReadRepo.findOne({ where: { messageId, userId } });
    if (existing) {
      return existing;
    }

    const read = this.messageReadRepo.create({ messageId, userId });
    return this.messageReadRepo.save(read);
  }

  async getUnreadCount(roomId: string, userId: string) {
    await this.getRoom(roomId, userId); // Verify access

    const totalMessages = await this.messageRepo.count({
      where: { roomId, isDeleted: false },
    });

    const readMessages = await this.messageReadRepo
      .createQueryBuilder('read')
      .innerJoin('read.message', 'message')
      .where('message.roomId = :roomId', { roomId })
      .andWhere('read.userId = :userId', { userId })
      .getCount();

    return totalMessages - readMessages;
  }
}
