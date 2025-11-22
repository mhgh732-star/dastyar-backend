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
import { ForumService } from './services/forum.service';
import {
  CreateForumDto,
  UpdateForumDto,
  CreateTopicDto,
  UpdateTopicDto,
  CreatePostDto,
  UpdatePostDto,
  ListTopicsDto,
} from './dto/forum.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('forum')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get('courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  listForums(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.forumService.listForums(courseId);
  }

  @Get(':forumId')
  @Roles('admin', 'teacher', 'student')
  getForum(@Param('forumId', new ParseUUIDPipe()) forumId: string) {
    return this.forumService.getForum(forumId);
  }

  @Post('courses/:courseId')
  @Roles('admin', 'teacher')
  createForum(@Param('courseId', new ParseUUIDPipe()) courseId: string, @Body() dto: Omit<CreateForumDto, 'courseId'>) {
    return this.forumService.createForum({ ...dto, courseId });
  }

  @Patch(':forumId')
  @Roles('admin', 'teacher')
  updateForum(@Param('forumId', new ParseUUIDPipe()) forumId: string, @Body() dto: UpdateForumDto) {
    return this.forumService.updateForum(forumId, dto);
  }

  @Delete(':forumId')
  @Roles('admin', 'teacher')
  deleteForum(@Param('forumId', new ParseUUIDPipe()) forumId: string) {
    return this.forumService.deleteForum(forumId);
  }

  @Get(':forumId/topics')
  @Roles('admin', 'teacher', 'student')
  listTopics(@Param('forumId', new ParseUUIDPipe()) forumId: string, @Query() query: ListTopicsDto) {
    return this.forumService.listTopics(forumId, query);
  }

  @Get('topics/:topicId')
  @Roles('admin', 'teacher', 'student')
  getTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string, @CurrentUser('userId') userId?: string) {
    return this.forumService.getTopic(topicId, userId);
  }

  @Post(':forumId/topics')
  @Roles('admin', 'teacher', 'student')
  createTopic(
    @Param('forumId', new ParseUUIDPipe()) forumId: string,
    @Body() body: Omit<CreateTopicDto, 'forumId'>,
    @CurrentUser('userId') userId: string,
  ) {
    return this.forumService.createTopic({ ...body, forumId }, userId);
  }

  @Patch('topics/:topicId')
  @Roles('admin', 'teacher', 'student')
  updateTopic(
    @Param('topicId', new ParseUUIDPipe()) topicId: string,
    @Body() dto: UpdateTopicDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.forumService.updateTopic(topicId, dto, userId);
  }

  @Delete('topics/:topicId')
  @Roles('admin', 'teacher', 'student')
  deleteTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string, @CurrentUser('userId') userId: string) {
    return this.forumService.deleteTopic(topicId, userId);
  }

  @Post('topics/:topicId/pin')
  @Roles('admin', 'teacher')
  pinTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    return this.forumService.pinTopic(topicId);
  }

  @Post('topics/:topicId/unpin')
  @Roles('admin', 'teacher')
  unpinTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    return this.forumService.unpinTopic(topicId);
  }

  @Post('topics/:topicId/lock')
  @Roles('admin', 'teacher')
  lockTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    return this.forumService.lockTopic(topicId);
  }

  @Post('topics/:topicId/unlock')
  @Roles('admin', 'teacher')
  unlockTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string) {
    return this.forumService.unlockTopic(topicId);
  }

  @Post('topics/:topicId/posts')
  @Roles('admin', 'teacher', 'student')
  createPost(
    @Param('topicId', new ParseUUIDPipe()) topicId: string,
    @Body() body: Omit<CreatePostDto, 'topicId'>,
    @CurrentUser('userId') userId?: string,
  ) {
    return this.forumService.createPost({ ...body, topicId }, userId);
  }

  @Patch('posts/:postId')
  @Roles('admin', 'teacher', 'student')
  updatePost(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.forumService.updatePost(postId, dto, userId);
  }

  @Delete('posts/:postId')
  @Roles('admin', 'teacher', 'student')
  deletePost(@Param('postId', new ParseUUIDPipe()) postId: string, @CurrentUser('userId') userId: string) {
    return this.forumService.deletePost(postId, userId);
  }

  @Post('topics/:topicId/subscribe')
  @Roles('admin', 'teacher', 'student')
  subscribeTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string, @CurrentUser('userId') userId: string) {
    return this.forumService.subscribeTopic(topicId, userId);
  }

  @Post('topics/:topicId/unsubscribe')
  @Roles('admin', 'teacher', 'student')
  unsubscribeTopic(@Param('topicId', new ParseUUIDPipe()) topicId: string, @CurrentUser('userId') userId: string) {
    return this.forumService.unsubscribeTopic(topicId, userId);
  }
}
