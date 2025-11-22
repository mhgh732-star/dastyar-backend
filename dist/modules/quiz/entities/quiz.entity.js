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
exports.QuizEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const content_item_entity_1 = require("../../content/entities/content-item.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const question_entity_1 = require("./question.entity");
const quiz_attempt_entity_1 = require("./quiz-attempt.entity");
let QuizEntity = class QuizEntity {
};
exports.QuizEntity = QuizEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], QuizEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_item_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "contentItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], QuizEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_limit', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "timeLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attempts_allowed', type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], QuizEntity.prototype, "attemptsAllowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passing_grade', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "passingGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shuffle_questions', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], QuizEntity.prototype, "shuffleQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shuffle_answers', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], QuizEntity.prototype, "shuffleAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_correct_answers', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], QuizEntity.prototype, "showCorrectAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'open_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "openDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'close_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "closeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], QuizEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], QuizEntity.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, (course) => course.quizzes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], QuizEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_item_entity_1.ContentItemEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'content_item_id' }),
    __metadata("design:type", content_item_entity_1.ContentItemEntity)
], QuizEntity.prototype, "contentItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.UserEntity)
], QuizEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_entity_1.QuestionEntity, (question) => question.quiz, { cascade: true }),
    __metadata("design:type", Array)
], QuizEntity.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quiz_attempt_entity_1.QuizAttemptEntity, (attempt) => attempt.quiz),
    __metadata("design:type", Array)
], QuizEntity.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuizEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QuizEntity.prototype, "updatedAt", void 0);
exports.QuizEntity = QuizEntity = __decorate([
    (0, typeorm_1.Entity)('quizzes')
], QuizEntity);
//# sourceMappingURL=quiz.entity.js.map