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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const quiz_service_1 = require("./quiz.service");
const create_quiz_dto_1 = require("./dto/create-quiz.dto");
const question_dto_1 = require("./dto/question.dto");
const attempts_service_1 = require("./services/attempts.service");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let QuizController = class QuizController {
    constructor(quizService, attemptsService) {
        this.quizService = quizService;
        this.attemptsService = attemptsService;
    }
    list(courseId) {
        return this.quizService.listByCourse(courseId);
    }
    findOne(quizId) {
        return this.quizService.getQuiz(quizId);
    }
    createQuiz(courseId, dto, userId) {
        return this.quizService.createQuiz(courseId, dto, userId);
    }
    updateQuiz(quizId, dto) {
        return this.quizService.updateQuiz(quizId, dto);
    }
    removeQuiz(quizId) {
        return this.quizService.deleteQuiz(quizId);
    }
    addQuestion(quizId, dto) {
        return this.quizService.addQuestion(quizId, dto);
    }
    updateQuestion(questionId, dto) {
        return this.quizService.updateQuestion(questionId, dto);
    }
    removeQuestion(questionId) {
        return this.quizService.removeQuestion(questionId);
    }
    startAttempt(quizId, userId) {
        return this.attemptsService.startAttempt(quizId, userId);
    }
    submitAttempt(dto) {
        return this.attemptsService.submitAttempt(dto);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Get)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':quizId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('quizId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_quiz_dto_1.CreateQuizDto, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "createQuiz", null);
__decorate([
    (0, common_1.Patch)(':quizId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('quizId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_quiz_dto_1.UpdateQuizDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "updateQuiz", null);
__decorate([
    (0, common_1.Delete)(':quizId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('quizId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "removeQuiz", null);
__decorate([
    (0, common_1.Post)(':quizId/questions'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('quizId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Patch)('questions/:questionId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('questionId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.UpdateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:questionId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('questionId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "removeQuestion", null);
__decorate([
    (0, common_1.Post)(':quizId/attempts'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('quizId', new common_1.ParseUUIDPipe())),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.Post)('attempts/submit'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "submitAttempt", null);
exports.QuizController = QuizController = __decorate([
    (0, common_1.Controller)('quiz'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [quiz_service_1.QuizService, attempts_service_1.AttemptsService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map