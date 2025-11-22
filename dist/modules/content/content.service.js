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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const content_repository_1 = require("./content.repository");
const content_item_entity_1 = require("./entities/content-item.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const course_section_entity_1 = require("../courses/entities/course-section.entity");
const resource_service_1 = require("./services/resource.service");
const editor_service_1 = require("./services/editor.service");
let ContentService = class ContentService {
    constructor(contentRepository, contentItemRepo, courseRepo, sectionRepo, resourceService, editorService) {
        this.contentRepository = contentRepository;
        this.contentItemRepo = contentItemRepo;
        this.courseRepo = courseRepo;
        this.sectionRepo = sectionRepo;
        this.resourceService = resourceService;
        this.editorService = editorService;
    }
    async listCourseContent(courseId) {
        await this.ensureCourse(courseId);
        return this.contentRepository.findCourseContent(courseId);
    }
    async createContent(courseId, dto, userId) {
        var _a, _b, _c;
        await this.ensureCourse(courseId);
        if (dto.sectionId) {
            await this.ensureSection(courseId, dto.sectionId);
        }
        const nextOrder = (_a = dto.itemOrder) !== null && _a !== void 0 ? _a : (await this.contentRepository.getNextOrder(courseId));
        const entity = this.contentItemRepo.create({
            courseId,
            sectionId: dto.sectionId,
            title: dto.title,
            contentType: dto.contentType,
            contentBody: dto.contentBody,
            resourceUrl: dto.resourceUrl,
            itemOrder: nextOrder,
            isVisible: (_b = dto.isVisible) !== null && _b !== void 0 ? _b : true,
            settings: (_c = dto.settings) !== null && _c !== void 0 ? _c : {},
            createdById: userId,
        });
        const saved = await this.contentItemRepo.save(entity);
        await this.editorService.syncPage(saved, dto.contentBody);
        return saved;
    }
    async updateContent(id, dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const content = await this.getContentOrThrow(id);
        if (dto.sectionId) {
            await this.ensureSection(content.courseId, dto.sectionId);
        }
        Object.assign(content, {
            sectionId: (_a = dto.sectionId) !== null && _a !== void 0 ? _a : content.sectionId,
            title: (_b = dto.title) !== null && _b !== void 0 ? _b : content.title,
            contentType: (_c = dto.contentType) !== null && _c !== void 0 ? _c : content.contentType,
            contentBody: (_d = dto.contentBody) !== null && _d !== void 0 ? _d : content.contentBody,
            resourceUrl: (_e = dto.resourceUrl) !== null && _e !== void 0 ? _e : content.resourceUrl,
            itemOrder: (_f = dto.itemOrder) !== null && _f !== void 0 ? _f : content.itemOrder,
            isVisible: (_g = dto.isVisible) !== null && _g !== void 0 ? _g : content.isVisible,
            settings: (_h = dto.settings) !== null && _h !== void 0 ? _h : content.settings,
        });
        const updated = await this.contentItemRepo.save(content);
        await this.editorService.syncPage(updated, dto.contentBody);
        return updated;
    }
    async reorder(courseId, dto) {
        if (!dto.items.length) {
            throw new common_1.BadRequestException('items cannot be empty');
        }
        const ids = dto.items.map((item) => item.id);
        const items = await this.contentItemRepo.find({ where: { id: (0, typeorm_2.In)(ids), courseId } });
        if (items.length !== dto.items.length) {
            throw new common_1.NotFoundException('One or more content items were not found');
        }
        await Promise.all(dto.items.map(({ id, order }) => this.contentItemRepo.update({ id }, { itemOrder: order })));
        return this.contentRepository.findCourseContent(courseId);
    }
    async removeContent(id) {
        const content = await this.getContentOrThrow(id);
        await this.contentItemRepo.softRemove(content);
        return { success: true };
    }
    async listFiles(contentId) {
        return this.resourceService.list(contentId);
    }
    async attachFile(contentId, dto) {
        await this.getContentOrThrow(contentId);
        return this.resourceService.attach(contentId, dto);
    }
    async removeFile(fileId) {
        return this.resourceService.remove(fileId);
    }
    async ensureCourse(courseId) {
        const exists = await this.courseRepo.exist({ where: { id: courseId } });
        if (!exists) {
            throw new common_1.NotFoundException('Course not found');
        }
    }
    async ensureSection(courseId, sectionId) {
        const section = await this.sectionRepo.findOne({ where: { id: sectionId, courseId } });
        if (!section) {
            throw new common_1.BadRequestException('Section does not belong to course');
        }
    }
    async getContentOrThrow(id) {
        const content = await this.contentItemRepo.findOne({ where: { id } });
        if (!content) {
            throw new common_1.NotFoundException('Content item not found');
        }
        return content;
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(content_item_entity_1.ContentItemEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(course_section_entity_1.CourseSectionEntity)),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        resource_service_1.ResourceService,
        editor_service_1.EditorService])
], ContentService);
//# sourceMappingURL=content.service.js.map