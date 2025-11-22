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
exports.ResourceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_meta_entity_1 = require("../entities/file-meta.entity");
const content_item_entity_1 = require("../entities/content-item.entity");
let ResourceService = class ResourceService {
    constructor(fileRepo, contentRepo) {
        this.fileRepo = fileRepo;
        this.contentRepo = contentRepo;
    }
    async list(contentId) {
        await this.ensureContent(contentId);
        return this.fileRepo.find({ where: { contentItemId: contentId } });
    }
    async attach(contentId, payload) {
        await this.ensureContent(contentId);
        const entity = this.fileRepo.create({
            contentItemId: contentId,
            filename: payload.filename,
            mimeType: payload.mimeType,
            url: payload.url,
            size: payload.size,
            storageProvider: payload.provider || 's3',
            metadata: payload.metadata || {},
        });
        return this.fileRepo.save(entity);
    }
    async remove(fileId) {
        const file = await this.fileRepo.findOne({ where: { id: fileId } });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        await this.fileRepo.remove(file);
        return { success: true };
    }
    async ensureContent(contentId) {
        const exists = await this.contentRepo.exist({ where: { id: contentId } });
        if (!exists) {
            throw new common_1.NotFoundException('Content item not found');
        }
    }
};
exports.ResourceService = ResourceService;
exports.ResourceService = ResourceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_meta_entity_1.FileMetaEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(content_item_entity_1.ContentItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ResourceService);
//# sourceMappingURL=resource.service.js.map