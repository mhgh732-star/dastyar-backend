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
exports.QuestionChoiceEntity = void 0;
const typeorm_1 = require("typeorm");
const question_entity_1 = require("./question.entity");
let QuestionChoiceEntity = class QuestionChoiceEntity {
};
exports.QuestionChoiceEntity = QuestionChoiceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionChoiceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_id', type: 'uuid' }),
    __metadata("design:type", String)
], QuestionChoiceEntity.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.QuestionEntity, (question) => question.choices, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", question_entity_1.QuestionEntity)
], QuestionChoiceEntity.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option_text', type: 'text' }),
    __metadata("design:type", String)
], QuestionChoiceEntity.prototype, "optionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_correct', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], QuestionChoiceEntity.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option_order', type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], QuestionChoiceEntity.prototype, "optionOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], QuestionChoiceEntity.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuestionChoiceEntity.prototype, "createdAt", void 0);
exports.QuestionChoiceEntity = QuestionChoiceEntity = __decorate([
    (0, typeorm_1.Entity)('quiz_question_choices')
], QuestionChoiceEntity);
//# sourceMappingURL=question-choice.entity.js.map