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
exports.FileEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const course_entity_1 = require("../../courses/entities/course.entity");
const storage_location_entity_1 = require("./storage-location.entity");
let FileEntity = class FileEntity {
};
exports.FileEntity = FileEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploaded_by', type: 'uuid' }),
    __metadata("design:type", String)
], FileEntity.prototype, "uploadedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_location_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "storageLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], FileEntity.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], FileEntity.prototype, "originalFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], FileEntity.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FileEntity.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FileEntity.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000 }),
    __metadata("design:type", String)
], FileEntity.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000, nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_public', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], FileEntity.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", Object)
], FileEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by' }),
    __metadata("design:type", user_entity_1.UserEntity)
], FileEntity.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storage_location_entity_1.StorageLocationEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'storage_location_id' }),
    __metadata("design:type", Object)
], FileEntity.prototype, "storageLocation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FileEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FileEntity.prototype, "updatedAt", void 0);
exports.FileEntity = FileEntity = __decorate([
    (0, typeorm_1.Entity)('files'),
    (0, typeorm_1.Index)(['courseId', 'createdAt']),
    (0, typeorm_1.Index)(['uploadedById', 'createdAt'])
], FileEntity);
//# sourceMappingURL=file.entity.js.map