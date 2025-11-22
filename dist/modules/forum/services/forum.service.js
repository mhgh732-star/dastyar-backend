"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const forum_entity_1 = require("../entities/forum.entity");
const topic_entity_1 = require("../entities/topic.entity");
const post_entity_1 = require("../entities/post.entity");
const topic_subscription_entity_1 = require("../entities/topic-subscription.entity");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let ForumService = class ForumService {
    constructor(forumRepo, topicRepo, postRepo, subscriptionRepo, courseRepo, userRepo) {
        this.forumRepo = forumRepo;
        this.topicRepo = topicRepo;
        this.postRepo = postRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }
    async listForums(courseId) {
        await this.ensureCourse(courseId);
        return this.forumRepo.find({
            where: { courseId },
            order: { sortOrder: 'ASC', createdAt: 'ASC' },
            relations: ['course'],
        });
    }
    async getForum(id) {
        const forum = await this.forumRepo.findOne({
            where: { id },
            relations: ['course'],
        });
        if (!forum)
            throw new common_1.NotFoundException('Forum not found');
        return forum;
    }
    async createForum(dto) {
        var _a, _b;
        await this.ensureCourse(dto.courseId);
        const maxOrder = await this.forumRepo
            .createQueryBuilder('f')
            .where('f.courseId = :courseId', { courseId: dto.courseId })
            .select('MAX(f.sortOrder)', 'max')
            .getRawOne();
        const forum = this.forumRepo.create({
            ...dto,
            forumType: (_a = dto.forumType) !== null && _a !== void 0 ? _a : 'general',
            sortOrder: ((_b = maxOrder === null || maxOrder === void 0 ? void 0 : maxOrder.max) !== null && _b !== void 0 ? _b : 0) + 1,
        });
        return this.forumRepo.save(forum);
    }
    async updateForum(id, dto) {
        const forum = await this.getForum(id);
        Object.assign(forum, dto);
        return this.forumRepo.save(forum);
    }
    async deleteForum(id) {
        const forum = await this.getForum(id);
        await this.forumRepo.remove(forum);
        return { success: true };
    }
    async listTopics(forumId, query = {}) {
        var _a, _b, _c;
        await this.getForum(forumId);
        const page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 20;
        const skip = (page - 1) * limit;
        const qb = this.topicRepo
            .createQueryBuilder('topic')
            .leftJoinAndSelect('topic.author', 'author')
            .leftJoinAndSelect('topic.lastPostBy', 'lastPostBy')
            .where('topic.forumId = :forumId', { forumId });
        if (query.isPinned !== undefined) {
            qb.andWhere('topic.isPinned = :isPinned', { isPinned: query.isPinned });
        }
        const sortBy = (_c = query.sortBy) !== null && _c !== void 0 ? _c : 'lastPostAt';
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
    async getTopic(id, userId) {
        const topic = await this.topicRepo.findOne({
            where: { id },
            relations: ['author', 'forum', 'lastPostBy', 'posts', 'posts.author'],
            order: { posts: { createdAt: 'ASC' } },
        });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        if (userId && userId !== topic.authorId) {
            topic.viewCount++;
            await this.topicRepo.save(topic);
        }
        return topic;
    }
    async createTopic(dto, authorId) {
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
    async updateTopic(id, dto, userId) {
        const topic = await this.getTopic(id);
        if (topic.authorId !== userId)
            throw new common_1.ForbiddenException('Only topic author can update');
        if (topic.isLocked)
            throw new common_1.BadRequestException('Topic is locked');
        Object.assign(topic, dto);
        topic.updatedAt = new Date();
        return this.topicRepo.save(topic);
    }
    async deleteTopic(id, userId) {
        const topic = await this.getTopic(id);
        if (topic.authorId !== userId)
            throw new common_1.ForbiddenException('Only topic author can delete');
        await this.topicRepo.remove(topic);
        return { success: true };
    }
    async pinTopic(id) {
        const topic = await this.getTopic(id);
        topic.isPinned = true;
        return this.topicRepo.save(topic);
    }
    async unpinTopic(id) {
        const topic = await this.getTopic(id);
        topic.isPinned = false;
        return this.topicRepo.save(topic);
    }
    async lockTopic(id) {
        const topic = await this.getTopic(id);
        topic.isLocked = true;
        return this.topicRepo.save(topic);
    }
    async unlockTopic(id) {
        const topic = await this.getTopic(id);
        topic.isLocked = false;
        return this.topicRepo.save(topic);
    }
    async createPost(dto, authorId) {
        var _a;
        const topic = await this.topicRepo.findOne({ where: { id: dto.topicId } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        if (topic.isLocked)
            throw new common_1.BadRequestException('Topic is locked');
        const post = this.postRepo.create({
            ...dto,
            authorId: dto.isAnonymous ? null : authorId,
            isAnonymous: (_a = dto.isAnonymous) !== null && _a !== void 0 ? _a : false,
        });
        const saved = await this.postRepo.save(post);
        topic.replyCount++;
        topic.lastPostAt = new Date();
        topic.lastPostById = authorId !== null && authorId !== void 0 ? authorId : null;
        await this.topicRepo.save(topic);
        return this.postRepo.findOne({
            where: { id: saved.id },
            relations: ['author', 'topic'],
        });
    }
    async updatePost(id, dto, userId) {
        const post = await this.postRepo.findOne({ where: { id }, relations: ['topic'] });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.authorId !== userId)
            throw new common_1.ForbiddenException('Only post author can update');
        if (post.topic.isLocked)
            throw new common_1.BadRequestException('Topic is locked');
        post.content = dto.content;
        post.isEdited = true;
        post.editedAt = new Date();
        return this.postRepo.save(post);
    }
    async deletePost(id, userId) {
        const post = await this.postRepo.findOne({ where: { id }, relations: ['topic'] });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.authorId !== userId)
            throw new common_1.ForbiddenException('Only post author can delete');
        const topic = post.topic;
        await this.postRepo.remove(post);
        topic.replyCount = Math.max(0, topic.replyCount - 1);
        await this.topicRepo.save(topic);
        return { success: true };
    }
    async subscribeTopic(topicId, userId) {
        await this.getTopic(topicId);
        const existing = await this.subscriptionRepo.findOne({ where: { topicId, userId } });
        if (existing)
            return existing;
        const subscription = this.subscriptionRepo.create({ topicId, userId });
        return this.subscriptionRepo.save(subscription);
    }
    async unsubscribeTopic(topicId, userId) {
        const subscription = await this.subscriptionRepo.findOne({ where: { topicId, userId } });
        if (subscription)
            await this.subscriptionRepo.remove(subscription);
        return { success: true };
    }
    async ensureCourse(courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
};
exports.ForumService = ForumService;
exports.ForumService = ForumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(forum_entity_1.ForumEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(topic_entity_1.TopicEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(post_entity_1.PostEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(topic_subscription_entity_1.TopicSubscriptionEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ForumService);
//# sourceMappingURL=forum.service.js.map