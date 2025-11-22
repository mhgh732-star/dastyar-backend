"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quiz_entity_1 = require("./entities/quiz.entity");
const question_entity_1 = require("./entities/question.entity");
const question_choice_entity_1 = require("./entities/question-choice.entity");
const quiz_attempt_entity_1 = require("./entities/quiz-attempt.entity");
const quiz_controller_1 = require("./quiz.controller");
const quiz_service_1 = require("./quiz.service");
const attempts_service_1 = require("./services/attempts.service");
const question_bank_service_1 = require("./services/question-bank.service");
const course_entity_1 = require("../courses/entities/course.entity");
const content_item_entity_1 = require("../content/entities/content-item.entity");
let QuizModule = class QuizModule {
};
exports.QuizModule = QuizModule;
exports.QuizModule = QuizModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                quiz_entity_1.QuizEntity,
                question_entity_1.QuestionEntity,
                question_choice_entity_1.QuestionChoiceEntity,
                quiz_attempt_entity_1.QuizAttemptEntity,
                course_entity_1.CourseEntity,
                content_item_entity_1.ContentItemEntity,
            ]),
        ],
        controllers: [quiz_controller_1.QuizController],
        providers: [quiz_service_1.QuizService, attempts_service_1.AttemptsService, question_bank_service_1.QuestionBankService],
        exports: [quiz_service_1.QuizService, attempts_service_1.AttemptsService, question_bank_service_1.QuestionBankService],
    })
], QuizModule);
//# sourceMappingURL=quiz.module.js.map