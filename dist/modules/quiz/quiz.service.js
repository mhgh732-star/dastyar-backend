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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("./entities/quiz.entity");
const question_entity_1 = require("./entities/question.entity");
const question_choice_entity_1 = require("./entities/question-choice.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const content_item_entity_1 = require("../content/entities/content-item.entity");
let QuizService = class QuizService {
    constructor(quizRepo, questionRepo, choiceRepo, courseRepo, contentRepo) {
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
        this.choiceRepo = choiceRepo;
        this.courseRepo = courseRepo;
        this.contentRepo = contentRepo;
    }
    async listByCourse(courseId) {
        await this.ensureCourse(courseId);
        return this.quizRepo.find({
            where: { courseId },
            relations: ['questions', 'questions.choices'],
            order: { createdAt: 'DESC' },
        });
    }
    async getQuiz(id) {
        const quiz = await this.quizRepo.findOne({
            where: { id },
            relations: ['questions', 'questions.choices'],
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        return quiz;
    }
    async createQuiz(courseId, dto, userId) {
        var _a, _b, _c, _d, _e, _f;
        await this.ensureCourse(courseId);
        if (dto.contentItemId) {
            await this.ensureContent(courseId, dto.contentItemId);
        }
        const quiz = this.quizRepo.create({
            courseId,
            contentItemId: dto.contentItemId,
            title: dto.title,
            description: dto.description,
            instructions: dto.instructions,
            timeLimit: dto.timeLimit,
            attemptsAllowed: (_a = dto.attemptsAllowed) !== null && _a !== void 0 ? _a : 1,
            passingGrade: dto.passingGrade,
            shuffleQuestions: (_b = dto.shuffleQuestions) !== null && _b !== void 0 ? _b : false,
            shuffleAnswers: (_c = dto.shuffleAnswers) !== null && _c !== void 0 ? _c : false,
            showCorrectAnswers: (_d = dto.showCorrectAnswers) !== null && _d !== void 0 ? _d : true,
            openDate: dto.openDate ? new Date(dto.openDate) : undefined,
            closeDate: dto.closeDate ? new Date(dto.closeDate) : undefined,
            settings: (_e = dto.settings) !== null && _e !== void 0 ? _e : {},
            createdById: userId,
        });
        const saved = await this.quizRepo.save(quiz);
        if ((_f = dto.questions) === null || _f === void 0 ? void 0 : _f.length) {
            await this.addBulkQuestions(saved.id, dto.questions);
        }
        return this.getQuiz(saved.id);
    }
    async updateQuiz(id, dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const quiz = await this.quizRepo.findOne({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        if (dto.contentItemId) {
            await this.ensureContent(quiz.courseId, dto.contentItemId);
        }
        Object.assign(quiz, {
            title: (_a = dto.title) !== null && _a !== void 0 ? _a : quiz.title,
            description: (_b = dto.description) !== null && _b !== void 0 ? _b : quiz.description,
            instructions: (_c = dto.instructions) !== null && _c !== void 0 ? _c : quiz.instructions,
            timeLimit: (_d = dto.timeLimit) !== null && _d !== void 0 ? _d : quiz.timeLimit,
            attemptsAllowed: (_e = dto.attemptsAllowed) !== null && _e !== void 0 ? _e : quiz.attemptsAllowed,
            passingGrade: (_f = dto.passingGrade) !== null && _f !== void 0 ? _f : quiz.passingGrade,
            shuffleQuestions: (_g = dto.shuffleQuestions) !== null && _g !== void 0 ? _g : quiz.shuffleQuestions,
            shuffleAnswers: (_h = dto.shuffleAnswers) !== null && _h !== void 0 ? _h : quiz.shuffleAnswers,
            showCorrectAnswers: (_j = dto.showCorrectAnswers) !== null && _j !== void 0 ? _j : quiz.showCorrectAnswers,
            openDate: dto.openDate ? new Date(dto.openDate) : quiz.openDate,
            closeDate: dto.closeDate ? new Date(dto.closeDate) : quiz.closeDate,
            settings: (_k = dto.settings) !== null && _k !== void 0 ? _k : quiz.settings,
            contentItemId: (_l = dto.contentItemId) !== null && _l !== void 0 ? _l : quiz.contentItemId,
        });
        await this.quizRepo.save(quiz);
        if ((_m = dto.questions) === null || _m === void 0 ? void 0 : _m.length) {
            await this.addBulkQuestions(quiz.id, dto.questions);
        }
        return this.getQuiz(id);
    }
    async deleteQuiz(id) {
        const quiz = await this.quizRepo.findOne({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        await this.quizRepo.remove(quiz);
        return { success: true };
    }
    async addQuestion(quizId, dto) {
        await this.getQuiz(quizId);
        const question = await this.createQuestionEntity(quizId, dto);
        await this.questionRepo.save(question);
        return this.getQuiz(quizId);
    }
    async updateQuestion(questionId, dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const question = await this.questionRepo.findOne({ where: { id: questionId }, relations: ['choices'] });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        Object.assign(question, {
            questionType: (_a = dto.questionType) !== null && _a !== void 0 ? _a : question.questionType,
            questionText: (_b = dto.questionText) !== null && _b !== void 0 ? _b : question.questionText,
            questionHtml: (_c = dto.questionHtml) !== null && _c !== void 0 ? _c : question.questionHtml,
            points: (_d = dto.points) !== null && _d !== void 0 ? _d : question.points,
            difficultyLevel: (_e = dto.difficultyLevel) !== null && _e !== void 0 ? _e : question.difficultyLevel,
            explanation: (_f = dto.explanation) !== null && _f !== void 0 ? _f : question.explanation,
            questionOrder: (_g = dto.questionOrder) !== null && _g !== void 0 ? _g : question.questionOrder,
            settings: (_h = dto.settings) !== null && _h !== void 0 ? _h : question.settings,
        });
        if (dto.choices) {
            await this.choiceRepo.delete({ questionId: question.id });
            question.choices = dto.choices.map((choice, index) => {
                var _a, _b;
                return this.choiceRepo.create({
                    questionId: question.id,
                    optionText: choice.optionText,
                    isCorrect: (_a = choice.isCorrect) !== null && _a !== void 0 ? _a : false,
                    optionOrder: (_b = choice.optionOrder) !== null && _b !== void 0 ? _b : index + 1,
                    feedback: choice.feedback,
                });
            });
        }
        await this.questionRepo.save(question);
        return this.getQuiz(question.quizId);
    }
    async removeQuestion(questionId) {
        const question = await this.questionRepo.findOne({ where: { id: questionId } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        await this.questionRepo.remove(question);
        return { success: true };
    }
    async addBulkQuestions(quizId, questions) {
        const entities = await Promise.all(questions.map((question) => this.createQuestionEntity(quizId, question)));
        await this.questionRepo.save(entities);
    }
    async createQuestionEntity(quizId, dto) {
        var _a, _b, _c;
        if (!((_a = dto.choices) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new common_1.BadRequestException('Question choices are required');
        }
        const question = this.questionRepo.create({
            quizId,
            questionType: dto.questionType,
            questionText: dto.questionText,
            questionHtml: dto.questionHtml,
            points: (_b = dto.points) !== null && _b !== void 0 ? _b : 1,
            difficultyLevel: dto.difficultyLevel,
            explanation: dto.explanation,
            questionOrder: dto.questionOrder,
            settings: (_c = dto.settings) !== null && _c !== void 0 ? _c : {},
        });
        question.choices = dto.choices.map((choice, index) => {
            var _a, _b;
            return this.choiceRepo.create({
                optionText: choice.optionText,
                isCorrect: (_a = choice.isCorrect) !== null && _a !== void 0 ? _a : false,
                optionOrder: (_b = choice.optionOrder) !== null && _b !== void 0 ? _b : index + 1,
                feedback: choice.feedback,
            });
        });
        return question;
    }
    async ensureCourse(courseId) {
        const exists = await this.courseRepo.exist({ where: { id: courseId } });
        if (!exists)
            throw new common_1.NotFoundException('Course not found');
    }
    async ensureContent(courseId, contentId) {
        const content = await this.contentRepo.findOne({ where: { id: contentId, courseId } });
        if (!content)
            throw new common_1.BadRequestException('Content item does not belong to course');
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.QuizEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.QuestionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(question_choice_entity_1.QuestionChoiceEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(content_item_entity_1.ContentItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map