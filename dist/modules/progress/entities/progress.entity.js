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
exports.ProgressEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const content_item_entity_1 = require("../../content/entities/content-item.entity");
let ProgressEntity = class ProgressEntity {
};
exports.ProgressEntity = ProgressEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProgressEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], ProgressEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], ProgressEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_item_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ProgressEntity.prototype, "contentItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completion_type', type: 'varchar', length: 50, default: 'view' }),
    __metadata("design:type", String)
], ProgressEntity.prototype, "completionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_completed', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProgressEntity.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ProgressEntity.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_spent', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ProgressEntity.prototype, "timeSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'progress_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProgressEntity.prototype, "progressPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], ProgressEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], ProgressEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ProgressEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_item_entity_1.ContentItemEntity, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'content_item_id' }),
    __metadata("design:type", Object)
], ProgressEntity.prototype, "contentItem", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProgressEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProgressEntity.prototype, "updatedAt", void 0);
exports.ProgressEntity = ProgressEntity = __decorate([
    (0, typeorm_1.Entity)('progress'),
    (0, typeorm_1.Index)(['courseId', 'userId']),
    (0, typeorm_1.Index)(['courseId', 'contentItemId', 'userId'], { unique: true })
], ProgressEntity);
//# sourceMappingURL=progress.entity.js.map