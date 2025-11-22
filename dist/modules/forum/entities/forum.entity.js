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
exports.ForumEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const topic_entity_1 = require("./topic.entity");
let ForumEntity = class ForumEntity {
};
exports.ForumEntity = ForumEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ForumEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], ForumEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ForumEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ForumEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'forum_type', type: 'varchar', length: 50, default: 'general' }),
    __metadata("design:type", String)
], ForumEntity.prototype, "forumType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_moderated', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ForumEntity.prototype, "isModerated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_anonymous', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ForumEntity.prototype, "allowAnonymous", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ForumEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], ForumEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => topic_entity_1.TopicEntity, (topic) => topic.forum),
    __metadata("design:type", Array)
], ForumEntity.prototype, "topics", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ForumEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ForumEntity.prototype, "updatedAt", void 0);
exports.ForumEntity = ForumEntity = __decorate([
    (0, typeorm_1.Entity)('forums'),
    (0, typeorm_1.Index)(['courseId', 'name'], { unique: true })
], ForumEntity);
//# sourceMappingURL=forum.entity.js.map