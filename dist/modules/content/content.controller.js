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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
const content_dto_1 = require("./dto/content.dto");
const upload_dto_1 = require("./dto/upload.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let ContentController = class ContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    list(courseId) {
        return this.contentService.listCourseContent(courseId);
    }
    create(courseId, dto, userId) {
        return this.contentService.createContent(courseId, dto, userId);
    }
    reorder(courseId, dto) {
        return this.contentService.reorder(courseId, dto);
    }
    update(contentId, dto) {
        return this.contentService.updateContent(contentId, dto);
    }
    remove(contentId) {
        return this.contentService.removeContent(contentId);
    }
    attachFile(contentId, dto) {
        return this.contentService.attachFile(contentId, dto);
    }
    listFiles(contentId) {
        return this.contentService.listFiles(contentId);
    }
    removeFile(fileId) {
        return this.contentService.removeFile(fileId);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.CreateContentDto, String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/reorder'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.ReorderContentDto]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':contentId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('contentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.UpdateContentDto]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':contentId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('contentId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':contentId/files'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('contentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upload_dto_1.UploadContentFileDto]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "attachFile", null);
__decorate([
    (0, common_1.Get)(':contentId/files'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('contentId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Delete)('files/:fileId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('fileId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "removeFile", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('content'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map