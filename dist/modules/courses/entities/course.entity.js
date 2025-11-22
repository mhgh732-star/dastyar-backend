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
exports.CourseEntity = void 0;
const typeorm_1 = require("typeorm");
const course_section_entity_1 = require("./course-section.entity");
const enrollment_entity_1 = require("./enrollment.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const activity_entity_1 = require("./activity.entity");
const quiz_entity_1 = require("../../quiz/entities/quiz.entity");
const assignment_entity_1 = require("../../assignments/entities/assignment.entity");
let CourseEntity = class CourseEntity {
};
exports.CourseEntity = CourseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CourseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CourseEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CourseEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CourseEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CourseEntity.prototype, "fullDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], CourseEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CourseEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CourseEntity.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CourseEntity.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], CourseEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], CourseEntity.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.UserEntity)
], CourseEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => course_section_entity_1.CourseSectionEntity, (section) => section.course, { cascade: true }),
    __metadata("design:type", Array)
], CourseEntity.prototype, "sections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => enrollment_entity_1.CourseEnrollmentEntity, (enrollment) => enrollment.course),
    __metadata("design:type", Array)
], CourseEntity.prototype, "enrollments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.CourseActivityEntity, (activity) => activity.course),
    __metadata("design:type", Array)
], CourseEntity.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quiz_entity_1.QuizEntity, (quiz) => quiz.course),
    __metadata("design:type", Array)
], CourseEntity.prototype, "quizzes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assignment_entity_1.AssignmentEntity, (assignment) => assignment.course),
    __metadata("design:type", Array)
], CourseEntity.prototype, "assignments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CourseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CourseEntity.prototype, "updatedAt", void 0);
exports.CourseEntity = CourseEntity = __decorate([
    (0, typeorm_1.Entity)('courses')
], CourseEntity);
//# sourceMappingURL=course.entity.js.map