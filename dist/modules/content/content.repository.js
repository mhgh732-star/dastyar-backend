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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const content_item_entity_1 = require("./entities/content-item.entity");
let ContentRepository = class ContentRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(content_item_entity_1.ContentItemEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    findCourseContent(courseId) {
        return this.createQueryBuilder('content')
            .leftJoinAndSelect('content.files', 'files')
            .leftJoinAndSelect('content.page', 'page')
            .where('content.courseId = :courseId', { courseId })
            .andWhere('content.deletedAt IS NULL')
            .orderBy('content.itemOrder', 'ASC')
            .getMany();
    }
    async getNextOrder(courseId) {
        var _a;
        const result = await this.createQueryBuilder('content')
            .select('MAX(content.itemOrder)', 'max')
            .where('content.courseId = :courseId', { courseId })
            .getRawOne();
        return ((_a = result === null || result === void 0 ? void 0 : result.max) !== null && _a !== void 0 ? _a : 0) + 1;
    }
};
exports.ContentRepository = ContentRepository;
exports.ContentRepository = ContentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ContentRepository);
//# sourceMappingURL=content.repository.js.map