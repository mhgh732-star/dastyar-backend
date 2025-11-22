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
exports.StorageLocationEntity = void 0;
const typeorm_1 = require("typeorm");
const file_entity_1 = require("./file.entity");
let StorageLocationEntity = class StorageLocationEntity {
};
exports.StorageLocationEntity = StorageLocationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StorageLocationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], StorageLocationEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], StorageLocationEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000 }),
    __metadata("design:type", String)
], StorageLocationEntity.prototype, "basePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000, nullable: true }),
    __metadata("design:type", Object)
], StorageLocationEntity.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], StorageLocationEntity.prototype, "bucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], StorageLocationEntity.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], StorageLocationEntity.prototype, "credentials", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], StorageLocationEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StorageLocationEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_entity_1.FileEntity, (file) => file.storageLocation),
    __metadata("design:type", Array)
], StorageLocationEntity.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StorageLocationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StorageLocationEntity.prototype, "updatedAt", void 0);
exports.StorageLocationEntity = StorageLocationEntity = __decorate([
    (0, typeorm_1.Entity)('storage_locations'),
    (0, typeorm_1.Index)(['name'], { unique: true })
], StorageLocationEntity);
//# sourceMappingURL=storage-location.entity.js.map