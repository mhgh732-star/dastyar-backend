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
exports.FileMetaEntity = void 0;
const typeorm_1 = require("typeorm");
const content_item_entity_1 = require("./content-item.entity");
let FileMetaEntity = class FileMetaEntity {
};
exports.FileMetaEntity = FileMetaEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileMetaEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_item_id', type: 'uuid' }),
    __metadata("design:type", String)
], FileMetaEntity.prototype, "contentItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FileMetaEntity.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FileMetaEntity.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], FileMetaEntity.prototype, "storageProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], FileMetaEntity.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FileMetaEntity.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], FileMetaEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FileMetaEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_item_entity_1.ContentItemEntity, (item) => item.files, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'content_item_id' }),
    __metadata("design:type", content_item_entity_1.ContentItemEntity)
], FileMetaEntity.prototype, "contentItem", void 0);
exports.FileMetaEntity = FileMetaEntity = __decorate([
    (0, typeorm_1.Entity)('content_files')
], FileMetaEntity);
//# sourceMappingURL=file-meta.entity.js.map