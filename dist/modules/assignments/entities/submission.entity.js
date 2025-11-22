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
exports.SubmissionEntity = void 0;
const typeorm_1 = require("typeorm");
const assignment_entity_1 = require("./assignment.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let SubmissionEntity = class SubmissionEntity {
};
exports.SubmissionEntity = SubmissionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubmissionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assignment_id', type: 'uuid' }),
    __metadata("design:type", String)
], SubmissionEntity.prototype, "assignmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], SubmissionEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assignment_entity_1.AssignmentEntity, (assignment) => assignment.submissions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assignment_id' }),
    __metadata("design:type", assignment_entity_1.AssignmentEntity)
], SubmissionEntity.prototype, "assignment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], SubmissionEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submission_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "submissionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 50, default: 'submitted' }),
    __metadata("design:type", String)
], SubmissionEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grade', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'graded_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "gradedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'graded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "gradedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'late_submission', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SubmissionEntity.prototype, "lateSubmission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], SubmissionEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'submitted_at' }),
    __metadata("design:type", Date)
], SubmissionEntity.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SubmissionEntity.prototype, "updatedAt", void 0);
exports.SubmissionEntity = SubmissionEntity = __decorate([
    (0, typeorm_1.Entity)('assignment_submissions')
], SubmissionEntity);
//# sourceMappingURL=submission.entity.js.map