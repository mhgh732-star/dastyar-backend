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
exports.GradebookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grade_entity_1 = require("../entities/grade.entity");
const grade_category_entity_1 = require("../entities/grade-category.entity");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let GradebookService = class GradebookService {
    constructor(gradeRepo, categoryRepo, courseRepo, userRepo) {
        this.gradeRepo = gradeRepo;
        this.categoryRepo = categoryRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }
    async listGrades(courseId, userId) {
        await this.ensureCourse(courseId);
        const where = { courseId };
        if (userId)
            where.userId = userId;
        return this.gradeRepo.find({
            where,
            relations: ['category', 'gradedBy', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async getGrade(id) {
        const grade = await this.gradeRepo.findOne({
            where: { id },
            relations: ['category', 'gradedBy', 'user', 'course'],
        });
        if (!grade)
            throw new common_1.NotFoundException('Grade not found');
        return grade;
    }
    async createGrade(dto, gradedById) {
        var _a;
        await this.ensureCourse(dto.courseId);
        await this.ensureUser(dto.userId);
        if (dto.categoryId)
            await this.ensureCategory(dto.courseId, dto.categoryId);
        const grade = this.gradeRepo.create({
            ...dto,
            maxGrade: (_a = dto.maxGrade) !== null && _a !== void 0 ? _a : 100,
            gradedById,
            gradedAt: new Date(),
        });
        return this.gradeRepo.save(grade);
    }
    async updateGrade(id, dto) {
        const grade = await this.getGrade(id);
        Object.assign(grade, dto);
        return this.gradeRepo.save(grade);
    }
    async deleteGrade(id) {
        const grade = await this.getGrade(id);
        await this.gradeRepo.remove(grade);
        return { success: true };
    }
    async listCategories(courseId) {
        await this.ensureCourse(courseId);
        return this.categoryRepo.find({
            where: { courseId },
            order: { itemOrder: 'ASC' },
        });
    }
    async createCategory(dto) {
        var _a, _b, _c;
        await this.ensureCourse(dto.courseId);
        const maxOrder = await this.categoryRepo
            .createQueryBuilder('cat')
            .where('cat.courseId = :courseId', { courseId: dto.courseId })
            .select('MAX(cat.itemOrder)', 'max')
            .getRawOne();
        const category = this.categoryRepo.create({
            ...dto,
            weight: (_a = dto.weight) !== null && _a !== void 0 ? _a : 0,
            aggregationMethod: (_b = dto.aggregationMethod) !== null && _b !== void 0 ? _b : 'mean',
            itemOrder: ((_c = maxOrder === null || maxOrder === void 0 ? void 0 : maxOrder.max) !== null && _c !== void 0 ? _c : 0) + 1,
        });
        return this.categoryRepo.save(category);
    }
    async updateCategory(id, dto) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        Object.assign(category, dto);
        return this.categoryRepo.save(category);
    }
    async deleteCategory(id) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        await this.categoryRepo.remove(category);
        return { success: true };
    }
    async calculateFinalGrade(courseId, userId) {
        await this.ensureCourse(courseId);
        await this.ensureUser(userId);
        const categories = await this.listCategories(courseId);
        const grades = await this.gradeRepo.find({
            where: { courseId, userId, isDropped: false, isExcused: false },
            relations: ['category'],
        });
        if (categories.length === 0) {
            const total = grades.reduce((sum, g) => sum + Number(g.grade), 0);
            const maxTotal = grades.reduce((sum, g) => sum + Number(g.maxGrade), 0);
            return { finalGrade: maxTotal > 0 ? (total / maxTotal) * 100 : 0, breakdown: [] };
        }
        const breakdown = [];
        let weightedSum = 0;
        let totalWeight = 0;
        for (const category of categories) {
            const categoryGrades = grades.filter((g) => g.categoryId === category.id);
            if (categoryGrades.length === 0)
                continue;
            let categoryGrade = this.aggregateGrades(categoryGrades, category.aggregationMethod);
            const weight = Number(category.weight);
            weightedSum += categoryGrade * weight;
            totalWeight += weight;
            breakdown.push({
                categoryId: category.id,
                categoryName: category.name,
                grade: categoryGrade,
                weight,
            });
        }
        const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;
        return { finalGrade, breakdown };
    }
    aggregateGrades(grades, method) {
        const values = grades.map((g) => Number(g.grade) / Number(g.maxGrade) * 100);
        if (values.length === 0)
            return 0;
        switch (method) {
            case 'mean':
                return values.reduce((a, b) => a + b, 0) / values.length;
            case 'sum':
                return values.reduce((a, b) => a + b, 0);
            case 'max':
                return Math.max(...values);
            case 'min':
                return Math.min(...values);
            case 'median':
                const sorted = [...values].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
            default:
                return values.reduce((a, b) => a + b, 0) / values.length;
        }
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
    async ensureCategory(courseId, categoryId) {
        const category = await this.categoryRepo.findOne({ where: { id: categoryId, courseId } });
        if (!category)
            throw new common_1.BadRequestException('Category not found in this course');
        return category;
    }
};
exports.GradebookService = GradebookService;
exports.GradebookService = GradebookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grade_entity_1.GradeEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(grade_category_entity_1.GradeCategoryEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GradebookService);
//# sourceMappingURL=gradebook.service.js.map