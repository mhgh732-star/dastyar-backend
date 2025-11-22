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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
const course_section_entity_1 = require("./entities/course-section.entity");
const enrollment_entity_1 = require("./entities/enrollment.entity");
const activity_entity_1 = require("./entities/activity.entity");
const pagination_utils_1 = require("../../common/utils/pagination.utils");
let CoursesService = class CoursesService {
    constructor(coursesRepository, sectionsRepository, enrollmentsRepository, activitiesRepository) {
        this.coursesRepository = coursesRepository;
        this.sectionsRepository = sectionsRepository;
        this.enrollmentsRepository = enrollmentsRepository;
        this.activitiesRepository = activitiesRepository;
    }
    async createCourse(dto, createdById) {
        var _a, _b;
        const course = this.coursesRepository.create({
            code: dto.code,
            title: dto.title,
            description: dto.description,
            fullDescription: dto.fullDescription,
            imageUrl: dto.imageUrl,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            isPublished: (_a = dto.isPublished) !== null && _a !== void 0 ? _a : false,
            createdById,
        });
        await this.coursesRepository.save(course);
        if ((_b = dto.sections) === null || _b === void 0 ? void 0 : _b.length) {
            await this.sectionsRepository.save(dto.sections.map((section, index) => {
                var _a;
                return this.sectionsRepository.create({
                    courseId: course.id,
                    title: section.title,
                    description: section.description,
                    sectionOrder: (_a = section.sectionOrder) !== null && _a !== void 0 ? _a : index + 1,
                });
            }));
        }
        return this.getCourse(course.id);
    }
    async updateCourse(id, dto) {
        var _a, _b, _c, _d, _e;
        const course = await this.getCourse(id);
        Object.assign(course, {
            title: (_a = dto.title) !== null && _a !== void 0 ? _a : course.title,
            description: (_b = dto.description) !== null && _b !== void 0 ? _b : course.description,
            fullDescription: (_c = dto.fullDescription) !== null && _c !== void 0 ? _c : course.fullDescription,
            imageUrl: (_d = dto.imageUrl) !== null && _d !== void 0 ? _d : course.imageUrl,
            startDate: dto.startDate ? new Date(dto.startDate) : course.startDate,
            endDate: dto.endDate ? new Date(dto.endDate) : course.endDate,
            isPublished: (_e = dto.isPublished) !== null && _e !== void 0 ? _e : course.isPublished,
        });
        await this.coursesRepository.save(course);
        return this.getCourse(id);
    }
    async listCourses(params) {
        const pagination = (0, pagination_utils_1.normalizePagination)(params);
        let whereClause;
        if (params.search) {
            whereClause = [
                { title: (0, typeorm_2.ILike)(`%${params.search}%`) },
                { code: (0, typeorm_2.ILike)(`%${params.search}%`) },
            ];
        }
        if (params.isPublished !== undefined && params.isPublished !== null) {
            if (whereClause) {
                whereClause = whereClause.map((condition) => ({ ...condition, isPublished: params.isPublished }));
            }
            else {
                whereClause = [{ isPublished: params.isPublished }];
            }
        }
        const [items, total] = await this.coursesRepository.findAndCount({
            where: whereClause,
            order: { createdAt: 'DESC' },
            relations: ['sections'],
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });
        return {
            items,
            meta: (0, pagination_utils_1.buildPaginationMeta)(total, pagination),
        };
    }
    async getCourse(id) {
        const course = await this.coursesRepository.findOne({
            where: { id },
            relations: ['sections', 'enrollments'],
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async enrollUser(courseId, dto) {
        var _a;
        await this.getCourse(courseId);
        const enrollment = this.enrollmentsRepository.create({
            courseId,
            userId: dto.userId,
            roleInCourse: (_a = dto.roleInCourse) !== null && _a !== void 0 ? _a : 'student',
        });
        return this.enrollmentsRepository.save(enrollment);
    }
    async addSection(courseId, dto) {
        var _a;
        await this.getCourse(courseId);
        const section = this.sectionsRepository.create({
            courseId,
            title: dto.title,
            description: dto.description,
            sectionOrder: (_a = dto.sectionOrder) !== null && _a !== void 0 ? _a : 1,
        });
        return this.sectionsRepository.save(section);
    }
    async recordActivity(courseId, event, payload, userId) {
        const activity = this.activitiesRepository.create({ courseId, event, payload, userId });
        return this.activitiesRepository.save(activity);
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(course_section_entity_1.CourseSectionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(enrollment_entity_1.CourseEnrollmentEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(activity_entity_1.CourseActivityEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map