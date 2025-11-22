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
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const forum_service_1 = require("./services/forum.service");
const forum_dto_1 = require("./dto/forum.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let ForumController = class ForumController {
    constructor(forumService) {
        this.forumService = forumService;
    }
    listForums(courseId) {
        return this.forumService.listForums(courseId);
    }
    getForum(forumId) {
        return this.forumService.getForum(forumId);
    }
    createForum(courseId, dto) {
        return this.forumService.createForum({ ...dto, courseId });
    }
    updateForum(forumId, dto) {
        return this.forumService.updateForum(forumId, dto);
    }
    deleteForum(forumId) {
        return this.forumService.deleteForum(forumId);
    }
    listTopics(forumId, query) {
        return this.forumService.listTopics(forumId, query);
    }
    getTopic(topicId, userId) {
        return this.forumService.getTopic(topicId, userId);
    }
    createTopic(forumId, body, userId) {
        return this.forumService.createTopic({ ...body, forumId }, userId);
    }
    updateTopic(topicId, dto, userId) {
        return this.forumService.updateTopic(topicId, dto, userId);
    }
    deleteTopic(topicId, userId) {
        return this.forumService.deleteTopic(topicId, userId);
    }
    pinTopic(topicId) {
        return this.forumService.pinTopic(topicId);
    }
    unpinTopic(topicId) {
        return this.forumService.unpinTopic(topicId);
    }
    lockTopic(topicId) {
        return this.forumService.lockTopic(topicId);
    }
    unlockTopic(topicId) {
        return this.forumService.unlockTopic(topicId);
    }
    createPost(topicId, body, userId) {
        return this.forumService.createPost({ ...body, topicId }, userId);
    }
    updatePost(postId, dto, userId) {
        return this.forumService.updatePost(postId, dto, userId);
    }
    deletePost(postId, userId) {
        return this.forumService.deletePost(postId, userId);
    }
    subscribeTopic(topicId, userId) {
        return this.forumService.subscribeTopic(topicId, userId);
    }
    unsubscribeTopic(topicId, userId) {
        return this.forumService.unsubscribeTopic(topicId, userId);
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.Get)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "listForums", null);
__decorate([
    (0, common_1.Get)(':forumId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('forumId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "getForum", null);
__decorate([
    (0, common_1.Post)('courses/:courseId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('courseId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "createForum", null);
__decorate([
    (0, common_1.Patch)(':forumId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('forumId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, forum_dto_1.UpdateForumDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "updateForum", null);
__decorate([
    (0, common_1.Delete)(':forumId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('forumId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "deleteForum", null);
__decorate([
    (0, common_1.Get)(':forumId/topics'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('forumId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, forum_dto_1.ListTopicsDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "listTopics", null);
__decorate([
    (0, common_1.Get)('topics/:topicId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "getTopic", null);
__decorate([
    (0, common_1.Post)(':forumId/topics'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('forumId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "createTopic", null);
__decorate([
    (0, common_1.Patch)('topics/:topicId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, forum_dto_1.UpdateTopicDto, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "updateTopic", null);
__decorate([
    (0, common_1.Delete)('topics/:topicId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "deleteTopic", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/pin'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "pinTopic", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/unpin'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "unpinTopic", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/lock'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "lockTopic", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/unlock'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "unlockTopic", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/posts'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "createPost", null);
__decorate([
    (0, common_1.Patch)('posts/:postId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('postId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, forum_dto_1.UpdatePostDto, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)('posts/:postId'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('postId', new common_1.ParseUUIDPipe())),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/subscribe'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "subscribeTopic", null);
__decorate([
    (0, common_1.Post)('topics/:topicId/unsubscribe'),
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'student'),
    __param(0, (0, common_1.Param)('topicId', new common_1.ParseUUIDPipe())),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "unsubscribeTopic", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)('forum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [forum_service_1.ForumService])
], ForumController);
//# sourceMappingURL=forum.controller.js.map