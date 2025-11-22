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
exports.PageEntity = void 0;
const typeorm_1 = require("typeorm");
const content_item_entity_1 = require("./content-item.entity");
let PageEntity = class PageEntity {
};
exports.PageEntity = PageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_item_id', type: 'uuid', unique: true }),
    __metadata("design:type", String)
], PageEntity.prototype, "contentItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PageEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PageEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], PageEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PageEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PageEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => content_item_entity_1.ContentItemEntity, (content) => content.page, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'content_item_id' }),
    __metadata("design:type", content_item_entity_1.ContentItemEntity)
], PageEntity.prototype, "contentItem", void 0);
exports.PageEntity = PageEntity = __decorate([
    (0, typeorm_1.Entity)('content_pages')
], PageEntity);
//# sourceMappingURL=page.entity.js.map