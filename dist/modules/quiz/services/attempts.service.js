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
exports.AttemptsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_attempt_entity_1 = require("../entities/quiz-attempt.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const question_entity_1 = require("../entities/question.entity");
let AttemptsService = class AttemptsService {
    constructor(attemptsRepo, quizRepo, questionRepo) {
        this.attemptsRepo = attemptsRepo;
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
    }
    async startAttempt(quizId, userId) {
        const quiz = await this.quizRepo.findOne({ where: { id: quizId }, relations: ['questions'] });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        const attemptsCount = await this.attemptsRepo.count({ where: { quizId, userId } });
        if (quiz.attemptsAllowed && attemptsCount >= quiz.attemptsAllowed) {
            throw new common_1.BadRequestException('You have reached the limit of attempts');
        }
        const attempt = this.attemptsRepo.create({
            quizId,
            userId,
            attemptNumber: attemptsCount + 1,
            status: 'in_progress',
            answers: [],
        });
        return this.attemptsRepo.save(attempt);
    }
    async submitAttempt(payload) {
        const attempt = await this.attemptsRepo.findOne({ where: { id: payload.attemptId }, relations: ['quiz'] });
        if (!attempt)
            throw new common_1.NotFoundException('Attempt not found');
        if (attempt.status === 'submitted') {
            throw new common_1.BadRequestException('Attempt already submitted');
        }
        const questions = await this.questionRepo.find({
            where: { quizId: attempt.quizId },
            relations: ['choices'],
        });
        const answersMap = new Map(payload.answers.map((answer) => [answer.questionId, answer]));
        let score = 0;
        let maxScore = 0;
        questions.forEach((question) => {
            var _a;
            maxScore += Number(question.points || 1);
            const answer = answersMap.get(question.id);
            if (!answer)
                return;
            if (question.questionType === 'multiple' || question.questionType === 'single') {
                const correctChoiceIds = question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.id).sort();
                const provided = (answer.choiceIds || []).sort();
                if (correctChoiceIds.length && this.areArraysEqual(correctChoiceIds, provided)) {
                    score += Number(question.points || 1);
                }
            }
            else if (answer.value && ((_a = question.settings) === null || _a === void 0 ? void 0 : _a.expectedAnswer)) {
                if (answer.value.trim().toLowerCase() === String(question.settings.expectedAnswer).trim().toLowerCase()) {
                    score += Number(question.points || 1);
                }
            }
        });
        const submittedAt = new Date();
        const timeTaken = attempt.startedAt ? Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000) : null;
        Object.assign(attempt, {
            answers: payload.answers,
            status: 'submitted',
            submittedAt,
            timeTaken: timeTaken !== null && timeTaken !== void 0 ? timeTaken : undefined,
            score,
            maxScore,
            percentage: maxScore ? (score / maxScore) * 100 : null,
        });
        await this.attemptsRepo.save(attempt);
        return attempt;
    }
    areArraysEqual(a, b) {
        if (a.length !== b.length)
            return false;
        return a.every((value, index) => value === b[index]);
    }
};
exports.AttemptsService = AttemptsService;
exports.AttemptsService = AttemptsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_attempt_entity_1.QuizAttemptEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(quiz_entity_1.QuizEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(question_entity_1.QuestionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttemptsService);
//# sourceMappingURL=attempts.service.js.map