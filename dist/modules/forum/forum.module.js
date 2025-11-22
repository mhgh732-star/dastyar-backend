"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const forum_controller_1 = require("./forum.controller");
const forum_service_1 = require("./services/forum.service");
const forum_entity_1 = require("./entities/forum.entity");
const topic_entity_1 = require("./entities/topic.entity");
const post_entity_1 = require("./entities/post.entity");
const topic_subscription_entity_1 = require("./entities/topic-subscription.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let ForumModule = class ForumModule {
};
exports.ForumModule = ForumModule;
exports.ForumModule = ForumModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                forum_entity_1.ForumEntity,
                topic_entity_1.TopicEntity,
                post_entity_1.PostEntity,
                topic_subscription_entity_1.TopicSubscriptionEntity,
                course_entity_1.CourseEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [forum_controller_1.ForumController],
        providers: [forum_service_1.ForumService],
        exports: [forum_service_1.ForumService],
    })
], ForumModule);
//# sourceMappingURL=forum.module.js.map