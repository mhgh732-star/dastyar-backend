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
exports.GradeEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const quiz_entity_1 = require("../../quiz/entities/quiz.entity");
const assignment_entity_1 = require("../../assignments/entities/assignment.entity");
const grade_category_entity_1 = require("./grade-category.entity");
let GradeEntity = class GradeEntity {
};
exports.GradeEntity = GradeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], GradeEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], GradeEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grade_item_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "gradeItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grade_item_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "gradeItemType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_grade', type: 'decimal', precision: 5, scale: 2, default: 100 }),
    __metadata("design:type", Number)
], GradeEntity.prototype, "maxGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_excused', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], GradeEntity.prototype, "isExcused", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_dropped', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], GradeEntity.prototype, "isDropped", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'graded_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "gradedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'graded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "gradedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], GradeEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], GradeEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grade_category_entity_1.GradeCategoryEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_1.QuizEntity, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'grade_item_id' }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assignment_entity_1.AssignmentEntity, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'grade_item_id' }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "assignment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'graded_by' }),
    __metadata("design:type", Object)
], GradeEntity.prototype, "gradedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GradeEntity.prototype, "updatedAt", void 0);
exports.GradeEntity = GradeEntity = __decorate([
    (0, typeorm_1.Entity)('grades'),
    (0, typeorm_1.Index)(['courseId', 'userId']),
    (0, typeorm_1.Index)(['courseId', 'gradeItemId', 'gradeItemType'])
], GradeEntity);
//# sourceMappingURL=grade.entity.js.map