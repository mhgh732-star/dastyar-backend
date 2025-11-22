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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("../entities/question.entity");
const question_choice_entity_1 = require("../entities/question-choice.entity");
let QuestionBankService = class QuestionBankService {
    constructor(questionRepo, choiceRepo) {
        this.questionRepo = questionRepo;
        this.choiceRepo = choiceRepo;
    }
    findByCourse(courseId) {
        return this.questionRepo.find({
            where: { quiz: { courseId } },
            relations: ['choices', 'quiz'],
        });
    }
    async duplicate(questionId, targetQuizId) {
        const question = await this.questionRepo.findOne({ where: { id: questionId }, relations: ['choices'] });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const clone = this.questionRepo.create({
            quizId: targetQuizId,
            questionType: question.questionType,
            questionText: question.questionText,
            questionHtml: question.questionHtml,
            points: question.points,
            difficultyLevel: question.difficultyLevel,
            explanation: question.explanation,
            questionOrder: question.questionOrder,
            settings: question.settings,
            choices: question.choices.map((choice) => this.choiceRepo.create({
                optionText: choice.optionText,
                isCorrect: choice.isCorrect,
                optionOrder: choice.optionOrder,
                feedback: choice.feedback,
            })),
        });
        return this.questionRepo.save(clone);
    }
};
exports.QuestionBankService = QuestionBankService;
exports.QuestionBankService = QuestionBankService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.QuestionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(question_choice_entity_1.QuestionChoiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionBankService);
//# sourceMappingURL=question-bank.service.js.map