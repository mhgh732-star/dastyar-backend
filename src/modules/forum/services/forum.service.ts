import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumEntity } from '../entities/forum.entity';
import { TopicEntity } from '../entities/topic.entity';
import { PostEntity } from '../entities/post.entity';
import { TopicSubscriptionEntity } from '../entities/topic-subscription.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import {
  CreateForumDto,
  UpdateForumDto,
  CreateTopicDto,
  UpdateTopicDto,
  CreatePostDto,
  UpdatePostDto,
  ListTopicsDto,
} from '../dto/forum.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumEntity) private readonly forumRepo: Repository<ForumEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepo: Repository<TopicEntity>,
    @InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(TopicSubscriptionEntity) private readonly subscriptionRepo: Repository<TopicSubscriptionEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  async listForums(courseId: string) {
    await this.ensureCourse(courseId);
    return this.forumRepo.find({
      where: { courseId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      relations: ['course'],
    });
  }

  async getForum(id: string) {
    const forum = await this.forumRepo.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!forum) throw new NotFoundException('Forum not found');
    return forum;
  }

  async createForum(dto: CreateForumDto) {
    await this.ensureCourse(dto.courseId);
    const maxOrder = await this.forumRepo
      .createQueryBuilder('f')
      .where('f.courseId = :courseId', { courseId: dto.courseId })
      .select('MAX(f.sortOrder)', 'max')
      .getRawOne<{ max: number | null }>();

    const forum = this.forumRepo.create({
      ...dto,
      forumType: dto.forumType ?? 'general',
      sortOrder: (maxOrder?.max ?? 0) + 1,
    });
    return this.forumRepo.save(forum);
  }

  async updateForum(id: string, dto: UpdateForumDto) {
    const forum = await this.getForum(id);
    Object.assign(forum, dto);
    return this.forumRepo.save(forum);
  }

  async deleteForum(id: string) {
    const forum = await this.getForum(id);
    await this.forumRepo.remove(forum);
    return { success: true };
  }

  async listTopics(forumId: string, query: ListTopicsDto = {}) {
    await this.getForum(forumId);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.topicRepo
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.author', 'author')
      .leftJoinAndSelect('topic.lastPostBy', 'lastPostBy')
      .where('topic.forumId = :forumId', { forumId });

    if (query.isPinned !== undefined) {
      qb.andWhere('topic.isPinned = :isPinned', { isPinned: query.isPinned });
    }

    const sortBy = query.sortBy ?? 'lastPostAt';
    const orderBy = sortBy === 'views' ? 'topic.viewCount' : sortBy === 'replies' ? 'topic.replyCount' : sortBy === 'createdAt' ? 'topic.createdAt' : 'topic.lastPostAt';
    qb.orderBy('topic.isPinned', 'DESC').addOrderBy(orderBy, 'DESC');

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

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

  async getTopic(id: string, userId?: string) {
    const topic = await this.topicRepo.findOne({
      where: { id },
      relations: ['author', 'forum', 'lastPostBy', 'posts', 'posts.author'],
      order: { posts: { createdAt: 'ASC' } },
    });
    if (!topic) throw new NotFoundException('Topic not found');

    if (userId && userId !== topic.authorId) {
      topic.viewCount++;
      await this.topicRepo.save(topic);
    }

    return topic;
  }

  async createTopic(dto: CreateTopicDto, authorId: string) {
    await this.getForum(dto.forumId);
    const topic = this.topicRepo.create({
      ...dto,
      authorId,
      lastPostAt: new Date(),
      lastPostById: authorId,
    });
    const saved = await this.topicRepo.save(topic);
    return this.getTopic(saved.id, authorId);
  }

  async updateTopic(id: string, dto: UpdateTopicDto, userId: string) {
    const topic = await this.getTopic(id);
    if (topic.authorId !== userId) throw new ForbiddenException('Only topic author can update');
    if (topic.isLocked) throw new BadRequestException('Topic is locked');

    Object.assign(topic, dto);
    topic.updatedAt = new Date();
    return this.topicRepo.save(topic);
  }

  async deleteTopic(id: string, userId: string) {
    const topic = await this.getTopic(id);
    if (topic.authorId !== userId) throw new ForbiddenException('Only topic author can delete');
    await this.topicRepo.remove(topic);
    return { success: true };
  }

  async pinTopic(id: string) {
    const topic = await this.getTopic(id);
    topic.isPinned = true;
    return this.topicRepo.save(topic);
  }

  async unpinTopic(id: string) {
    const topic = await this.getTopic(id);
    topic.isPinned = false;
    return this.topicRepo.save(topic);
  }

  async lockTopic(id: string) {
    const topic = await this.getTopic(id);
    topic.isLocked = true;
    return this.topicRepo.save(topic);
  }

  async unlockTopic(id: string) {
    const topic = await this.getTopic(id);
    topic.isLocked = false;
    return this.topicRepo.save(topic);
  }

  async createPost(dto: CreatePostDto, authorId?: string) {
    const topic = await this.topicRepo.findOne({ where: { id: dto.topicId } });
    if (!topic) throw new NotFoundException('Topic not found');
    if (topic.isLocked) throw new BadRequestException('Topic is locked');

    const post = this.postRepo.create({
      ...dto,
      authorId: dto.isAnonymous ? null : authorId,
      isAnonymous: dto.isAnonymous ?? false,
    });
    const saved = await this.postRepo.save(post);

    topic.replyCount++;
    topic.lastPostAt = new Date();
    topic.lastPostById = authorId ?? null;
    await this.topicRepo.save(topic);

    return this.postRepo.findOne({
      where: { id: saved.id },
      relations: ['author', 'topic'],
    });
  }

  async updatePost(id: string, dto: UpdatePostDto, userId: string) {
    const post = await this.postRepo.findOne({ where: { id }, relations: ['topic'] });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Only post author can update');
    if (post.topic.isLocked) throw new BadRequestException('Topic is locked');

    post.content = dto.content;
    post.isEdited = true;
    post.editedAt = new Date();
    return this.postRepo.save(post);
  }

  async deletePost(id: string, userId: string) {
    const post = await this.postRepo.findOne({ where: { id }, relations: ['topic'] });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Only post author can delete');

    const topic = post.topic;
    await this.postRepo.remove(post);

    topic.replyCount = Math.max(0, topic.replyCount - 1);
    await this.topicRepo.save(topic);

    return { success: true };
  }

  async subscribeTopic(topicId: string, userId: string) {
    await this.getTopic(topicId);
    const existing = await this.subscriptionRepo.findOne({ where: { topicId, userId } });
    if (existing) return existing;

    const subscription = this.subscriptionRepo.create({ topicId, userId });
    return this.subscriptionRepo.save(subscription);
  }

  async unsubscribeTopic(topicId: string, userId: string) {
    const subscription = await this.subscriptionRepo.findOne({ where: { topicId, userId } });
    if (subscription) await this.subscriptionRepo.remove(subscription);
    return { success: true };
  }

  private async ensureCourse(courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
