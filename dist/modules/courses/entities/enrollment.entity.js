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
exports.CourseEnrollmentEntity = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("./course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let CourseEnrollmentEntity = class CourseEnrollmentEntity {
};
exports.CourseEnrollmentEntity = CourseEnrollmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CourseEnrollmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', type: 'uuid' }),
    __metadata("design:type", String)
], CourseEnrollmentEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], CourseEnrollmentEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'student' }),
    __metadata("design:type", String)
], CourseEnrollmentEntity.prototype, "roleInCourse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'active' }),
    __metadata("design:type", String)
], CourseEnrollmentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CourseEnrollmentEntity.prototype, "enrolledAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.CourseEntity, (course) => course.enrollments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.CourseEntity)
], CourseEnrollmentEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], CourseEnrollmentEntity.prototype, "user", void 0);
exports.CourseEnrollmentEntity = CourseEnrollmentEntity = __decorate([
    (0, typeorm_1.Entity)('course_enrollments'),
    (0, typeorm_1.Index)(['courseId', 'userId'], { unique: true })
], CourseEnrollmentEntity);
//# sourceMappingURL=enrollment.entity.js.map