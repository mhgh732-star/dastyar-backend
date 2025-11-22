"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const content_controller_1 = require("./content.controller");
const content_service_1 = require("./content.service");
const content_item_entity_1 = require("./entities/content-item.entity");
const file_meta_entity_1 = require("./entities/file-meta.entity");
const page_entity_1 = require("./entities/page.entity");
const book_entity_1 = require("./entities/book.entity");
const content_repository_1 = require("./content.repository");
const course_entity_1 = require("../courses/entities/course.entity");
const course_section_entity_1 = require("../courses/entities/course-section.entity");
const resource_service_1 = require("./services/resource.service");
const editor_service_1 = require("./services/editor.service");
let ContentModule = class ContentModule {
};
exports.ContentModule = ContentModule;
exports.ContentModule = ContentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([content_item_entity_1.ContentItemEntity, file_meta_entity_1.FileMetaEntity, page_entity_1.PageEntity, book_entity_1.BookEntity, course_entity_1.CourseEntity, course_section_entity_1.CourseSectionEntity])],
        controllers: [content_controller_1.ContentController],
        providers: [content_service_1.ContentService, content_repository_1.ContentRepository, resource_service_1.ResourceService, editor_service_1.EditorService],
        exports: [content_service_1.ContentService],
    })
], ContentModule);
//# sourceMappingURL=content.module.js.map