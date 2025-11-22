"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const progress_controller_1 = require("./progress.controller");
const gradebook_service_1 = require("./services/gradebook.service");
const progress_service_1 = require("./services/progress.service");
const grade_entity_1 = require("./entities/grade.entity");
const grade_category_entity_1 = require("./entities/grade-category.entity");
const progress_entity_1 = require("./entities/progress.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const content_item_entity_1 = require("../content/entities/content-item.entity");
let ProgressModule = class ProgressModule {
};
exports.ProgressModule = ProgressModule;
exports.ProgressModule = ProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                grade_entity_1.GradeEntity,
                grade_category_entity_1.GradeCategoryEntity,
                progress_entity_1.ProgressEntity,
                course_entity_1.CourseEntity,
                user_entity_1.UserEntity,
                content_item_entity_1.ContentItemEntity,
            ]),
        ],
        controllers: [progress_controller_1.ProgressController],
        providers: [gradebook_service_1.GradebookService, progress_service_1.ProgressService],
        exports: [gradebook_service_1.GradebookService, progress_service_1.ProgressService],
    })
], ProgressModule);
//# sourceMappingURL=progress.module.js.map