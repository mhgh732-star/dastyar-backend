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
exports.FileManagerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_manager_service_1 = require("./services/file-manager.service");
const storage_location_entity_1 = require("./entities/storage-location.entity");
const file_dto_1 = require("./dto/file.dto");
const upload_presign_dto_1 = require("./dto/upload-presign.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let FileManagerController = class FileManagerController {
    constructor(fileManagerService, storageRepo) {
        this.fileManagerService = fileManagerService;
        this.storageRepo = storageRepo;
    }
    listFiles(query, userId) {
        return this.fileManagerService.listFiles(query, userId);
    }
    getFile(fileId) {
        return this.fileManagerService.getFile(fileId);
    }
    getFileUrl(fileId) {
        return this.fileManagerService.getFileUrl(fileId);
    }
    uploadFile(file, dto, userId) {
        if (!file)
            throw new Error('No file uploaded');
        return this.fileManagerService.createFile(file, dto, userId);
    }
    updateFile(fileId, dto) {
        return this.fileManagerService.updateFile(fileId, dto);
    }
    deleteFile(fileId) {
        return this.fileManagerService.deleteFile(fileId);
    }
    getPresignedUrl(dto) {
        return { url: '/files/upload', method: 'POST' };
    }
    listStorageLocations() {
        return this.storageRepo.find({ order: { isDefault: 'DESC', createdAt: 'ASC' } });
    }
    createStorageLocation(dto) {
        const location = this.storageRepo.create(dto);
        return this.storageRepo.save(location);
    }
    updateStorageLocation(locationId, dto) {
        return this.storageRepo.update(locationId, dto);
    }
};
exports.FileManagerController = FileManagerController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_dto_1.ListFilesDto, String]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)(':fileId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('fileId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "getFile", null);
__decorate([
    (0, common_1.Get)(':fileId/url'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('fileId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "getFileUrl", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, file_dto_1.UploadFileDto, String]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Patch)(':fileId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('fileId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, file_dto_1.UpdateFileDto]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "updateFile", null);
__decorate([
    (0, common_1.Delete)(':fileId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('fileId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Post)('presign'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_presign_dto_1.GetPresignedUrlDto]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "getPresignedUrl", null);
__decorate([
    (0, common_1.Get)('storage/locations'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "listStorageLocations", null);
__decorate([
    (0, common_1.Post)('storage/locations'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_dto_1.CreateStorageLocationDto]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "createStorageLocation", null);
__decorate([
    (0, common_1.Patch)('storage/locations/:locationId'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('locationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, file_dto_1.UpdateStorageLocationDto]),
    __metadata("design:returntype", void 0)
], FileManagerController.prototype, "updateStorageLocation", null);
exports.FileManagerController = FileManagerController = __decorate([
    (0, common_1.Controller)('files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __param(1, (0, typeorm_1.InjectRepository)(storage_location_entity_1.StorageLocationEntity)),
    __metadata("design:paramtypes", [file_manager_service_1.FileManagerService,
        typeorm_2.Repository])
], FileManagerController);
//# sourceMappingURL=file-manager.controller.js.map