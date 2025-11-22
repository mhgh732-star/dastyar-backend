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
exports.TopicSubscriptionEntity = void 0;
const typeorm_1 = require("typeorm");
const topic_entity_1 = require("./topic.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let TopicSubscriptionEntity = class TopicSubscriptionEntity {
};
exports.TopicSubscriptionEntity = TopicSubscriptionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TopicSubscriptionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'topic_id', type: 'uuid' }),
    __metadata("design:type", String)
], TopicSubscriptionEntity.prototype, "topicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], TopicSubscriptionEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => topic_entity_1.TopicEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'topic_id' }),
    __metadata("design:type", topic_entity_1.TopicEntity)
], TopicSubscriptionEntity.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], TopicSubscriptionEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TopicSubscriptionEntity.prototype, "createdAt", void 0);
exports.TopicSubscriptionEntity = TopicSubscriptionEntity = __decorate([
    (0, typeorm_1.Entity)('topic_subscriptions'),
    (0, typeorm_1.Index)(['topicId', 'userId'], { unique: true })
], TopicSubscriptionEntity);
//# sourceMappingURL=topic-subscription.entity.js.map