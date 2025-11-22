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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicEntity = void 0;
const typeorm_1 = require("typeorm");
const forum_entity_1 = require("./forum.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const post_entity_1 = require("./post.entity");
const topic_subscription_entity_1 = require("./topic-subscription.entity");
let TopicEntity = class TopicEntity {
};
exports.TopicEntity = TopicEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TopicEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'forum_id', type: 'uuid' }),
    __metadata("design:type", String)
], TopicEntity.prototype, "forumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'uuid' }),
    __metadata("design:type", String)
], TopicEntity.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], TopicEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TopicEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_pinned', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TopicEntity.prototype, "isPinned", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_locked', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TopicEntity.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], TopicEntity.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reply_count', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], TopicEntity.prototype, "replyCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_post_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], TopicEntity.prototype, "lastPostAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_post_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TopicEntity.prototype, "lastPostById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => forum_entity_1.ForumEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'forum_id' }),
    __metadata("design:type", forum_entity_1.ForumEntity)
], TopicEntity.prototype, "forum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], TopicEntity.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'last_post_by' }),
    __metadata("design:type", Object)
], TopicEntity.prototype, "lastPostBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_entity_1.PostEntity, (post) => post.topic),
    __metadata("design:type", Array)
], TopicEntity.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => topic_subscription_entity_1.TopicSubscriptionEntity, (sub) => sub.topic),
    __metadata("design:type", Array)
], TopicEntity.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TopicEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TopicEntity.prototype, "updatedAt", void 0);
exports.TopicEntity = TopicEntity = __decorate([
    (0, typeorm_1.Entity)('topics'),
    (0, typeorm_1.Index)(['forumId', 'createdAt'])
], TopicEntity);
//# sourceMappingURL=topic.entity.js.map