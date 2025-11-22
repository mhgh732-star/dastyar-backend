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
exports.GradeCategoryEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../courses/entities/course.entity");
const grade_entity_1 = require("./grade.entity");
let GradeCategoryEntity = class GradeCategoryEntity {
};
exports.GradeCategoryEntity = GradeCategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradeCategoryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], GradeCategoryEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], GradeCategoryEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], GradeCategoryEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], GradeCategoryEntity.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aggregation_method', type: 'varchar', length: 50, default: 'mean' }),
    __metadata("design:type", String)
], GradeCategoryEntity.prototype, "aggregationMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drop_lowest', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], GradeCategoryEntity.prototype, "dropLowest", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drop_highest', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], GradeCategoryEntity.prototype, "dropHighest", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_order', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], GradeCategoryEntity.prototype, "itemOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], GradeCategoryEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => grade_entity_1.GradeEntity, (grade) => grade.category),
    __metadata("design:type", Array)
], GradeCategoryEntity.prototype, "grades", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradeCategoryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GradeCategoryEntity.prototype, "updatedAt", void 0);
exports.GradeCategoryEntity = GradeCategoryEntity = __decorate([
    (0, typeorm_1.Entity)('grade_categories'),
    (0, typeorm_1.Index)(['courseId', 'name'], { unique: true })
], GradeCategoryEntity);
//# sourceMappingURL=grade-category.entity.js.map