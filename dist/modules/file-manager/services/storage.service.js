"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const path = require("path");
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
let StorageService = class StorageService {
    async uploadFile(file, storage, courseId) {
        switch (storage.provider) {
            case 'local':
                return this.uploadToLocal(file, storage, courseId);
            case 's3':
                return this.uploadToS3(file, storage, courseId);
            default:
                throw new common_1.BadRequestException(`Storage provider ${storage.provider} not implemented`);
        }
    }
    async deleteFile(filePath, storage) {
        switch (storage.provider) {
            case 'local':
                await this.deleteFromLocal(filePath, storage);
                break;
            case 's3':
                await this.deleteFromS3(filePath, storage);
                break;
            default:
                throw new common_1.BadRequestException(`Storage provider ${storage.provider} not implemented`);
        }
    }
    async getFileUrl(filePath, storage) {
        switch (storage.provider) {
            case 'local':
                return this.getLocalFileUrl(filePath, storage);
            case 's3':
                return this.getS3FileUrl(filePath, storage);
            default:
                throw new common_1.BadRequestException(`Storage provider ${storage.provider} not implemented`);
        }
    }
    async uploadToLocal(file, storage, courseId) {
        const uploadDir = courseId
            ? path.join(storage.basePath, 'courses', courseId)
            : path.join(storage.basePath, 'general');
        await fs.mkdir(uploadDir, { recursive: true });
        const fileId = uuidv4();
        const ext = path.extname(file.originalname);
        const filename = `${fileId}${ext}`;
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, file.buffer);
        return filePath;
    }
    async deleteFromLocal(filePath, storage) {
        try {
            await fs.unlink(filePath);
        }
        catch (error) {
        }
    }
    getLocalFileUrl(filePath, storage) {
        const relativePath = path.relative(storage.basePath, filePath);
        return `/files/${relativePath.replace(/\\/g, '/')}`;
    }
    async uploadToS3(file, storage, courseId) {
        const prefix = courseId ? `courses/${courseId}/` : 'general/';
        return `${prefix}${uuidv4()}-${file.originalname}`;
    }
    async deleteFromS3(filePath, storage) {
    }
    getS3FileUrl(filePath, storage) {
        var _a;
        if (storage.bucket) {
            return `https://${storage.bucket}.s3.${(_a = storage.region) !== null && _a !== void 0 ? _a : 'us-east-1'}.amazonaws.com/${filePath}`;
        }
        return filePath;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)()
], StorageService);
//# sourceMappingURL=storage.service.js.map