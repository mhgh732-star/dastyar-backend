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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("../courses.service");
const create_course_dto_1 = require("../dto/create-course.dto");
const update_course_dto_1 = require("../dto/update-course.dto");
const enroll_dto_1 = require("../dto/enroll.dto");
const section_dto_1 = require("../dto/section.dto");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const permission_decorator_1 = require("../../../common/decorators/permission.decorator");
const user_decorator_1 = require("../../../common/decorators/user.decorator");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async list(page, limit, search, isPublished) {
        return this.coursesService.listCourses({
            page,
            limit,
            search,
            isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        });
    }
    async getCourse(id) {
        return this.coursesService.getCourse(id);
    }
    async create(userId, dto) {
        return this.coursesService.createCourse(dto, userId);
    }
    async update(id, dto) {
        return this.coursesService.updateCourse(id, dto);
    }
    async addSection(id, dto) {
        return this.coursesService.addSection(id, dto);
    }
    async enroll(id, dto) {
        return this.coursesService.enrollUser(id, dto);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('isPublished')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourse", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, permission_decorator_1.Permissions)('courses.create'),
    __param(0, (0, user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, permission_decorator_1.Permissions)('courses.update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sections'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, permission_decorator_1.Permissions)('courses.manageSections'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, section_dto_1.CreateSectionDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "addSection", null);
__decorate([
    (0, common_1.Post)(':id/enrollments'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, permission_decorator_1.Permissions)('courses.enrollUsers'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, enroll_dto_1.EnrollUserDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "enroll", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.Controller)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map