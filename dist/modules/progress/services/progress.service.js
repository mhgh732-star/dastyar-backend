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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const progress_entity_1 = require("../entities/progress.entity");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const content_item_entity_1 = require("../../content/entities/content-item.entity");
let ProgressService = class ProgressService {
    constructor(progressRepo, courseRepo, userRepo, contentRepo) {
        this.progressRepo = progressRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
        this.contentRepo = contentRepo;
    }
    async trackCompletion(dto) {
        var _a, _b, _c, _d, _e;
        await this.ensureCourse(dto.courseId);
        await this.ensureUser(dto.userId);
        if (dto.contentItemId)
            await this.ensureContent(dto.courseId, dto.contentItemId);
        let progress = await this.progressRepo.findOne({
            where: {
                courseId: dto.courseId,
                userId: dto.userId,
                contentItemId: dto.contentItemId ? dto.contentItemId : (0, typeorm_2.IsNull)(),
            },
        });
        if (!progress) {
            progress = this.progressRepo.create({
                courseId: dto.courseId,
                userId: dto.userId,
                contentItemId: dto.contentItemId,
                completionType: (_a = dto.completionType) !== null && _a !== void 0 ? _a : 'view',
                timeSpent: (_b = dto.timeSpent) !== null && _b !== void 0 ? _b : 0,
                progressPercentage: (_c = dto.progressPercentage) !== null && _c !== void 0 ? _c : 0,
                metadata: dto.metadata,
            });
        }
        else {
            progress.timeSpent = ((_d = progress.timeSpent) !== null && _d !== void 0 ? _d : 0) + ((_e = dto.timeSpent) !== null && _e !== void 0 ? _e : 0);
            if (dto.progressPercentage !== undefined) {
                progress.progressPercentage = Math.max(progress.progressPercentage, dto.progressPercentage);
            }
            if (dto.metadata) {
                progress.metadata = { ...progress.metadata, ...dto.metadata };
            }
        }
        if (dto.completionType === 'view' || progress.progressPercentage >= 100) {
            progress.isCompleted = true;
            progress.completedAt = new Date();
        }
        return this.progressRepo.save(progress);
    }
    async getCourseProgress(courseId, userId) {
        await this.ensureCourse(courseId);
        const where = { courseId };
        if (userId)
            where.userId = userId;
        const progressItems = await this.progressRepo.find({
            where,
            relations: ['contentItem', 'user'],
            order: { createdAt: 'DESC' },
        });
        const totalItems = await this.contentRepo.count({ where: { courseId } });
        const completedItems = progressItems.filter((p) => p.isCompleted).length;
        const totalTimeSpent = progressItems.reduce((sum, p) => { var _a; return sum + ((_a = p.timeSpent) !== null && _a !== void 0 ? _a : 0); }, 0);
        const overallCompletion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
        return {
            courseId,
            userId,
            overallCompletion,
            completedActivities: completedItems,
            totalActivities: totalItems,
            timeSpent: totalTimeSpent,
            activities: progressItems.map((p) => {
                var _a;
                return ({
                    contentItemId: p.contentItemId,
                    title: (_a = p.contentItem) === null || _a === void 0 ? void 0 : _a.title,
                    completionType: p.completionType,
                    isCompleted: p.isCompleted,
                    completedAt: p.completedAt,
                    timeSpent: p.timeSpent,
                    progressPercentage: p.progressPercentage,
                });
            }),
        };
    }
    async getUserProgressSummary(userId) {
        await this.ensureUser(userId);
        const allProgress = await this.progressRepo.find({
            where: { userId },
            relations: ['course', 'contentItem'],
        });
        const byCourse = allProgress.reduce((acc, p) => {
            var _a, _b;
            if (!acc[p.courseId]) {
                acc[p.courseId] = {
                    courseId: p.courseId,
                    courseTitle: (_a = p.course) === null || _a === void 0 ? void 0 : _a.title,
                    completed: 0,
                    total: 0,
                    timeSpent: 0,
                };
            }
            if (p.isCompleted)
                acc[p.courseId].completed++;
            acc[p.courseId].total++;
            acc[p.courseId].timeSpent += (_b = p.timeSpent) !== null && _b !== void 0 ? _b : 0;
            return acc;
        }, {});
        return Object.values(byCourse).map((course) => ({
            ...course,
            completionPercentage: course.total > 0 ? (course.completed / course.total) * 100 : 0,
        }));
    }
    async ensureCourse(courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async ensureUser(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async ensureContent(courseId, contentId) {
        const content = await this.contentRepo.findOne({ where: { id: contentId, courseId } });
        if (!content)
            throw new common_1.NotFoundException('Content item not found in this course');
        return content;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(progress_entity_1.ProgressEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(content_item_entity_1.ContentItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProgressService);
//# sourceMappingURL=progress.service.js.map