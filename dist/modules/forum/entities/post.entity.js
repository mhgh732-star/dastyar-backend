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
exports.PostEntity = void 0;
const typeorm_1 = require("typeorm");
const topic_entity_1 = require("./topic.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let PostEntity = class PostEntity {
};
exports.PostEntity = PostEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'topic_id', type: 'uuid' }),
    __metadata("design:type", String)
], PostEntity.prototype, "topicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], PostEntity.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PostEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_edited', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "isEdited", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'edited_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], PostEntity.prototype, "editedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_anonymous', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "isAnonymous", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => topic_entity_1.TopicEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'topic_id' }),
    __metadata("design:type", topic_entity_1.TopicEntity)
], PostEntity.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", Object)
], PostEntity.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PostEntity.prototype, "updatedAt", void 0);
exports.PostEntity = PostEntity = __decorate([
    (0, typeorm_1.Entity)('posts'),
    (0, typeorm_1.Index)(['topicId', 'createdAt'])
], PostEntity);
//# sourceMappingURL=post.entity.js.map