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
exports.ContentItemEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const course_section_entity_1 = require("../../courses/entities/course-section.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const file_meta_entity_1 = require("./file-meta.entity");
const page_entity_1 = require("./page.entity");
let ContentItemEntity = class ContentItemEntity {
};
exports.ContentItemEntity = ContentItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ContentItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], ContentItemEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ContentItemEntity.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ContentItemEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ContentItemEntity.prototype, "contentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_body', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ContentItemEntity.prototype, "contentBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resource_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ContentItemEntity.prototype, "resourceUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_order', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ContentItemEntity.prototype, "itemOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_visible', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ContentItemEntity.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], ContentItemEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], ContentItemEntity.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ContentItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ContentItemEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at', nullable: true }),
    __metadata("design:type", Object)
], ContentItemEntity.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], ContentItemEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_section_entity_1.CourseSectionEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'section_id' }),
    __metadata("design:type", course_section_entity_1.CourseSectionEntity)
], ContentItemEntity.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ContentItemEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_meta_entity_1.FileMetaEntity, (file) => file.contentItem, { cascade: true }),
    __metadata("design:type", Array)
], ContentItemEntity.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => page_entity_1.PageEntity, (page) => page.contentItem, { cascade: true }),
    __metadata("design:type", page_entity_1.PageEntity)
], ContentItemEntity.prototype, "page", void 0);
exports.ContentItemEntity = ContentItemEntity = __decorate([
    (0, typeorm_1.Entity)('content_items'),
    (0, typeorm_1.Index)(['courseId', 'itemOrder'])
], ContentItemEntity);
//# sourceMappingURL=content-item.entity.js.map