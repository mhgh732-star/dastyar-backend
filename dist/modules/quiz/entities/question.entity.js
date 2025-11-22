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
exports.QuestionEntity = void 0;
const typeorm_1 = require("typeorm");
const quiz_entity_1 = require("./quiz.entity");
const question_choice_entity_1 = require("./question-choice.entity");
let QuestionEntity = class QuestionEntity {
};
exports.QuestionEntity = QuestionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quiz_id', type: 'uuid' }),
    __metadata("design:type", String)
], QuestionEntity.prototype, "quizId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_1.QuizEntity, (quiz) => quiz.questions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'quiz_id' }),
    __metadata("design:type", quiz_entity_1.QuizEntity)
], QuestionEntity.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], QuestionEntity.prototype, "questionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_text', type: 'text' }),
    __metadata("design:type", String)
], QuestionEntity.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_html', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], QuestionEntity.prototype, "questionHtml", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], QuestionEntity.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'difficulty_level', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], QuestionEntity.prototype, "difficultyLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], QuestionEntity.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_order', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], QuestionEntity.prototype, "questionOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], QuestionEntity.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_choice_entity_1.QuestionChoiceEntity, (choice) => choice.question, { cascade: true }),
    __metadata("design:type", Array)
], QuestionEntity.prototype, "choices", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuestionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QuestionEntity.prototype, "updatedAt", void 0);
exports.QuestionEntity = QuestionEntity = __decorate([
    (0, typeorm_1.Entity)('quiz_questions')
], QuestionEntity);
//# sourceMappingURL=question.entity.js.map