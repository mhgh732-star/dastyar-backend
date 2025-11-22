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
exports.QuizAttemptEntity = void 0;
const typeorm_1 = require("typeorm");
const quiz_entity_1 = require("./quiz.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let QuizAttemptEntity = class QuizAttemptEntity {
};
exports.QuizAttemptEntity = QuizAttemptEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizAttemptEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quiz_id', type: 'uuid' }),
    __metadata("design:type", String)
], QuizAttemptEntity.prototype, "quizId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], QuizAttemptEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attempt_number', type: 'integer' }),
    __metadata("design:type", Number)
], QuizAttemptEntity.prototype, "attemptNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_1.QuizEntity, (quiz) => quiz.attempts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'quiz_id' }),
    __metadata("design:type", quiz_entity_1.QuizEntity)
], QuizAttemptEntity.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], QuizAttemptEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], QuizAttemptEntity.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], QuizAttemptEntity.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_taken', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], QuizAttemptEntity.prototype, "timeTaken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], QuizAttemptEntity.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], QuizAttemptEntity.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], QuizAttemptEntity.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'in_progress' }),
    __metadata("design:type", String)
], QuizAttemptEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], QuizAttemptEntity.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuizAttemptEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QuizAttemptEntity.prototype, "updatedAt", void 0);
exports.QuizAttemptEntity = QuizAttemptEntity = __decorate([
    (0, typeorm_1.Entity)('quiz_attempts')
], QuizAttemptEntity);
//# sourceMappingURL=quiz-attempt.entity.js.map