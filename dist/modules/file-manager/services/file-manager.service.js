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
exports.FileManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_entity_1 = require("../entities/file.entity");
const storage_location_entity_1 = require("../entities/storage-location.entity");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const storage_service_1 = require("./storage.service");
let FileManagerService = class FileManagerService {
    constructor(fileRepo, storageRepo, courseRepo, userRepo, storageService) {
        this.fileRepo = fileRepo;
        this.storageRepo = storageRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
        this.storageService = storageService;
    }
    async listFiles(query = {}, userId) {
        var _a, _b;
        const page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 20;
        const skip = (page - 1) * limit;
        const qb = this.fileRepo
            .createQueryBuilder('file')
            .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
            .leftJoinAndSelect('file.course', 'course')
            .leftJoinAndSelect('file.storageLocation', 'storageLocation');
        if (query.courseId) {
            qb.andWhere('file.courseId = :courseId', { courseId: query.courseId });
        }
        if (query.fileType) {
            qb.andWhere('file.fileType = :fileType', { fileType: query.fileType });
        }
        if (userId) {
            qb.andWhere('file.uploadedById = :userId', { userId });
        }
        qb.orderBy('file.createdAt', 'DESC');
        const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return {
            items,
            meta: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getFile(id) {
        const file = await this.fileRepo.findOne({
            where: { id },
            relations: ['uploadedBy', 'course', 'storageLocation'],
        });
        if (!file)
            throw new common_1.NotFoundException('File not found');
        return file;
    }
    async createFile(file, dto, userId) {
        var _a, _b;
        if (dto.courseId)
            await this.ensureCourse(dto.courseId);
        await this.ensureUser(userId);
        const defaultStorage = await this.getDefaultStorage();
        const fileType = this.detectFileType(file.mimetype);
        const filePath = await this.storageService.uploadFile(file, defaultStorage, dto.courseId);
        const fileEntity = this.fileRepo.create({
            courseId: dto.courseId,
            uploadedById: userId,
            storageLocationId: defaultStorage.id,
            filename: (_a = dto.filename) !== null && _a !== void 0 ? _a : file.originalname,
            originalFilename: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            fileType,
            filePath,
            url: await this.storageService.getFileUrl(filePath, defaultStorage),
            isPublic: (_b = dto.isPublic) !== null && _b !== void 0 ? _b : false,
            metadata: dto.metadata,
        });
        return this.fileRepo.save(fileEntity);
    }
    async updateFile(id, dto) {
        const file = await this.getFile(id);
        Object.assign(file, dto);
        return this.fileRepo.save(file);
    }
    async deleteFile(id) {
        const file = await this.getFile(id);
        if (file.storageLocation) {
            await this.storageService.deleteFile(file.filePath, file.storageLocation);
        }
        await this.fileRepo.remove(file);
        return { success: true };
    }
    async getFileUrl(id) {
        const file = await this.getFile(id);
        if (!file.storageLocation)
            throw new common_1.BadRequestException('File storage location not found');
        return this.storageService.getFileUrl(file.filePath, file.storageLocation);
    }
    detectFileType(mimeType) {
        if (mimeType.startsWith('image/'))
            return 'image';
        if (mimeType.startsWith('video/'))
            return 'video';
        if (mimeType.startsWith('audio/'))
            return 'audio';
        if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text'))
            return 'document';
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar'))
            return 'archive';
        return 'other';
    }
    async getDefaultStorage() {
        const storage = await this.storageRepo.findOne({ where: { isDefault: true, isActive: true } });
        if (!storage)
            throw new common_1.BadRequestException('No default storage location configured');
        return storage;
    }
    async ensureCourse(courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async ensureUser(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
};
exports.FileManagerService = FileManagerService;
exports.FileManagerService = FileManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.FileEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(storage_location_entity_1.StorageLocationEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        storage_service_1.StorageService])
], FileManagerService);
//# sourceMappingURL=file-manager.service.js.map