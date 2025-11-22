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
exports.AssignmentEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const content_item_entity_1 = require("../../content/entities/content-item.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const submission_entity_1 = require("./submission.entity");
let AssignmentEntity = class AssignmentEntity {
};
exports.AssignmentEntity = AssignmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_item_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "contentItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cut_off_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "cutOffDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_grade', type: 'decimal', precision: 5, scale: 2, default: 100 }),
    __metadata("design:type", Number)
], AssignmentEntity.prototype, "maxGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submission_type', type: 'varchar', length: 50, default: 'online_text' }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "submissionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_file_size', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "maxFileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_file_types', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "allowedFileTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_late_submission', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssignmentEntity.prototype, "allowLateSubmission", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'enable_peer_review', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AssignmentEntity.prototype, "enablePeerReview", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], AssignmentEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], AssignmentEntity.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, (course) => course.assignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], AssignmentEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_item_entity_1.ContentItemEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'content_item_id' }),
    __metadata("design:type", content_item_entity_1.ContentItemEntity)
], AssignmentEntity.prototype, "contentItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.UserEntity)
], AssignmentEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => submission_entity_1.SubmissionEntity, (submission) => submission.assignment),
    __metadata("design:type", Array)
], AssignmentEntity.prototype, "submissions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AssignmentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AssignmentEntity.prototype, "updatedAt", void 0);
exports.AssignmentEntity = AssignmentEntity = __decorate([
    (0, typeorm_1.Entity)('assignments')
], AssignmentEntity);
//# sourceMappingURL=assignment.entity.js.map