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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./entities/assignment.entity");
const submission_entity_1 = require("./entities/submission.entity");
const peer_review_entity_1 = require("./entities/peer-review.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const content_item_entity_1 = require("../content/entities/content-item.entity");
let AssignmentsService = class AssignmentsService {
    constructor(assignmentsRepo, submissionsRepo, peerReviewRepo, courseRepo, contentRepo) {
        this.assignmentsRepo = assignmentsRepo;
        this.submissionsRepo = submissionsRepo;
        this.peerReviewRepo = peerReviewRepo;
        this.courseRepo = courseRepo;
        this.contentRepo = contentRepo;
    }
    async listByCourse(courseId) {
        await this.ensureCourse(courseId);
        return this.assignmentsRepo.find({ where: { courseId }, order: { dueDate: 'ASC' } });
    }
    async getAssignment(id) {
        const assignment = await this.assignmentsRepo.findOne({ where: { id } });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        return assignment;
    }
    async createAssignment(courseId, dto, userId) {
        var _a, _b, _c, _d, _e;
        await this.ensureCourse(courseId);
        if (dto.contentItemId) {
            await this.ensureContent(courseId, dto.contentItemId);
        }
        const assignment = this.assignmentsRepo.create({
            courseId,
            contentItemId: dto.contentItemId,
            title: dto.title,
            description: dto.description,
            instructions: dto.instructions,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            cutOffDate: dto.cutOffDate ? new Date(dto.cutOffDate) : undefined,
            maxGrade: (_a = dto.maxGrade) !== null && _a !== void 0 ? _a : 100,
            submissionType: (_b = dto.submissionType) !== null && _b !== void 0 ? _b : 'online_text',
            maxFileSize: dto.maxFileSize,
            allowedFileTypes: dto.allowedFileTypes,
            allowLateSubmission: (_c = dto.allowLateSubmission) !== null && _c !== void 0 ? _c : false,
            enablePeerReview: (_d = dto.enablePeerReview) !== null && _d !== void 0 ? _d : false,
            settings: (_e = dto.settings) !== null && _e !== void 0 ? _e : {},
            createdById: userId,
        });
        return this.assignmentsRepo.save(assignment);
    }
    async updateAssignment(id, dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const assignment = await this.getAssignment(id);
        if (dto.contentItemId) {
            await this.ensureContent(assignment.courseId, dto.contentItemId);
        }
        Object.assign(assignment, {
            title: (_a = dto.title) !== null && _a !== void 0 ? _a : assignment.title,
            description: (_b = dto.description) !== null && _b !== void 0 ? _b : assignment.description,
            instructions: (_c = dto.instructions) !== null && _c !== void 0 ? _c : assignment.instructions,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : assignment.dueDate,
            cutOffDate: dto.cutOffDate ? new Date(dto.cutOffDate) : assignment.cutOffDate,
            maxGrade: (_d = dto.maxGrade) !== null && _d !== void 0 ? _d : assignment.maxGrade,
            submissionType: (_e = dto.submissionType) !== null && _e !== void 0 ? _e : assignment.submissionType,
            maxFileSize: (_f = dto.maxFileSize) !== null && _f !== void 0 ? _f : assignment.maxFileSize,
            allowedFileTypes: (_g = dto.allowedFileTypes) !== null && _g !== void 0 ? _g : assignment.allowedFileTypes,
            allowLateSubmission: (_h = dto.allowLateSubmission) !== null && _h !== void 0 ? _h : assignment.allowLateSubmission,
            enablePeerReview: (_j = dto.enablePeerReview) !== null && _j !== void 0 ? _j : assignment.enablePeerReview,
            settings: (_k = dto.settings) !== null && _k !== void 0 ? _k : assignment.settings,
            contentItemId: (_l = dto.contentItemId) !== null && _l !== void 0 ? _l : assignment.contentItemId,
        });
        await this.assignmentsRepo.save(assignment);
        return assignment;
    }
    async deleteAssignment(id) {
        const assignment = await this.getAssignment(id);
        await this.assignmentsRepo.remove(assignment);
        return { success: true };
    }
    async submitAssignment(dto, userId) {
        const assignment = await this.getAssignment(dto.assignmentId);
        const now = new Date();
        if (assignment.cutOffDate && now > assignment.cutOffDate) {
            throw new common_1.BadRequestException('Assignment is closed');
        }
        const lateSubmission = assignment.dueDate ? now > assignment.dueDate : false;
        if (lateSubmission && !assignment.allowLateSubmission) {
            throw new common_1.BadRequestException('Late submission is not allowed');
        }
        const submission = this.submissionsRepo.create({
            assignmentId: assignment.id,
            userId,
            submissionText: dto.submissionText,
            fileUrl: dto.fileUrl,
            lateSubmission,
            metadata: {},
        });
        return this.submissionsRepo.save(submission);
    }
    async listSubmissions(assignmentId) {
        await this.getAssignment(assignmentId);
        return this.submissionsRepo.find({ where: { assignmentId }, relations: ['user'] });
    }
    async gradeSubmission(dto, graderId) {
        const submission = await this.submissionsRepo.findOne({ where: { id: dto.submissionId } });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        Object.assign(submission, {
            grade: dto.grade,
            feedback: dto.feedback,
            gradedBy: graderId,
            gradedAt: new Date(),
            status: 'graded',
        });
        await this.submissionsRepo.save(submission);
        return submission;
    }
    async ensureCourse(courseId) {
        const exists = await this.courseRepo.exist({ where: { id: courseId } });
        if (!exists)
            throw new common_1.NotFoundException('Course not found');
    }
    async ensureContent(courseId, contentId) {
        const content = await this.contentRepo.findOne({ where: { id: contentId, courseId } });
        if (!content)
            throw new common_1.BadRequestException('Content item does not belong to course');
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.AssignmentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(submission_entity_1.SubmissionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(peer_review_entity_1.PeerReviewEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(content_item_entity_1.ContentItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map