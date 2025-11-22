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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const gradebook_service_1 = require("./services/gradebook.service");
const progress_service_1 = require("./services/progress.service");
const grade_dto_1 = require("./dto/grade.dto");
const progress_dto_1 = require("./dto/progress.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let ProgressController = class ProgressController {
    constructor(gradebookService, progressService) {
        this.gradebookService = gradebookService;
        this.progressService = progressService;
    }
    trackCompletion(dto) {
        return this.progressService.trackCompletion(dto);
    }
    getCourseProgress(courseId, userId) {
        return this.progressService.getCourseProgress(courseId, userId);
    }
    getUserProgressSummary(userId) {
        return this.progressService.getUserProgressSummary(userId);
    }
    listGrades(courseId, userId) {
        return this.gradebookService.listGrades(courseId, userId);
    }
    getGrade(gradeId) {
        return this.gradebookService.getGrade(gradeId);
    }
    createGrade(dto, userId) {
        return this.gradebookService.createGrade(dto, userId);
    }
    updateGrade(gradeId, dto) {
        return this.gradebookService.updateGrade(gradeId, dto);
    }
    deleteGrade(gradeId) {
        return this.gradebookService.deleteGrade(gradeId);
    }
    listCategories(courseId) {
        return this.gradebookService.listCategories(courseId);
    }
    createCategory(dto) {
        return this.gradebookService.createCategory(dto);
    }
    updateCategory(categoryId, dto) {
        return this.gradebookService.updateCategory(categoryId, dto);
    }
    deleteCategory(categoryId) {
        return this.gradebookService.deleteCategory(categoryId);
    }
    calculateFinalGrade(courseId, userId) {
        return this.gradebookService.calculateFinalGrade(courseId, userId);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Post)('track'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [progress_dto_1.TrackCompletionDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "trackCompletion", null);
__decorate([
    (0, common_1.Get)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getCourseProgress", null);
__decorate([
    (0, common_1.Get)('users/:userId/summary'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getUserProgressSummary", null);
__decorate([
    (0, common_1.Get)('grades/courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "listGrades", null);
__decorate([
    (0, common_1.Get)('grades/:gradeId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('gradeId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getGrade", null);
__decorate([
    (0, common_1.Post)('grades'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grade_dto_1.CreateGradeDto, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "createGrade", null);
__decorate([
    (0, common_1.Patch)('grades/:gradeId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('gradeId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, grade_dto_1.UpdateGradeDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "updateGrade", null);
__decorate([
    (0, common_1.Delete)('grades/:gradeId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('gradeId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "deleteGrade", null);
__decorate([
    (0, common_1.Get)('categories/courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "listCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grade_dto_1.CreateGradeCategoryDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:categoryId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('categoryId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, grade_dto_1.UpdateGradeCategoryDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:categoryId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('categoryId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('final-grade/courses/:courseId/users/:userId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "calculateFinalGrade", null);
exports.ProgressController = ProgressController = __decorate([
    (0, common_1.Controller)('progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [gradebook_service_1.GradebookService,
        progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map