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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const user_profile_entity_1 = require("./entities/user-profile.entity");
const user_settings_entity_1 = require("./entities/user-settings.entity");
const password_utils_1 = require("../../common/utils/password.utils");
const pagination_utils_1 = require("../../common/utils/pagination.utils");
let UsersService = class UsersService {
    constructor(usersRepository, profilesRepository, settingsRepository) {
        this.usersRepository = usersRepository;
        this.profilesRepository = profilesRepository;
        this.settingsRepository = settingsRepository;
    }
    async create(dto) {
        var _a;
        const exists = await this.usersRepository.findOne({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.ConflictException('Email already registered');
        }
        const user = this.usersRepository.create({
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            passwordHash: await (0, password_utils_1.hashPassword)(dto.password),
            roles: ((_a = dto.roles) === null || _a === void 0 ? void 0 : _a.length) ? dto.roles : ['student'],
        });
        await this.usersRepository.save(user);
        await this.upsertProfile(user.id, {
            jobTitle: dto.jobTitle,
            phone: dto.phone,
            timezone: dto.timezone,
            language: dto.language,
        });
        await this.upsertSettings(user.id, {
            emailNotificationsEnabled: dto.emailNotificationsEnabled,
            pushNotificationsEnabled: dto.pushNotificationsEnabled,
            theme: dto.theme,
        });
        return this.findOne(user.id);
    }
    async findAll(params) {
        const pagination = (0, pagination_utils_1.normalizePagination)({ page: params.page, limit: params.limit });
        const where = params.search
            ? [
                { firstName: (0, typeorm_2.ILike)(`%${params.search}%`) },
                { lastName: (0, typeorm_2.ILike)(`%${params.search}%`) },
                { email: (0, typeorm_2.ILike)(`%${params.search}%`) },
            ]
            : undefined;
        const [items, total] = await this.usersRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            relations: ['profile', 'settings'],
        });
        return {
            items,
            meta: (0, pagination_utils_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['profile', 'settings'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, dto) {
        var _a;
        const user = await this.findOne(id);
        if (dto.firstName)
            user.firstName = dto.firstName;
        if (dto.lastName)
            user.lastName = dto.lastName;
        if ((_a = dto.roles) === null || _a === void 0 ? void 0 : _a.length)
            user.roles = dto.roles;
        await this.usersRepository.save(user);
        await this.upsertProfile(id, {
            jobTitle: dto.jobTitle,
            phone: dto.phone,
            timezone: dto.timezone,
            language: dto.language,
        });
        await this.upsertSettings(id, {
            emailNotificationsEnabled: dto.emailNotificationsEnabled,
            pushNotificationsEnabled: dto.pushNotificationsEnabled,
            theme: dto.theme,
        });
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
        return { success: true };
    }
    async upsertProfile(userId, payload) {
        const existing = await this.profilesRepository.findOne({ where: { userId } });
        if (existing) {
            Object.assign(existing, payload);
            await this.profilesRepository.save(existing);
            return;
        }
        const profile = this.profilesRepository.create({ userId, ...payload });
        await this.profilesRepository.save(profile);
    }
    async upsertSettings(userId, payload) {
        var _a, _b, _c;
        const existing = await this.settingsRepository.findOne({ where: { userId } });
        if (existing) {
            Object.assign(existing, payload);
            await this.settingsRepository.save(existing);
            return;
        }
        const settings = this.settingsRepository.create({
            userId,
            emailNotificationsEnabled: (_a = payload.emailNotificationsEnabled) !== null && _a !== void 0 ? _a : true,
            pushNotificationsEnabled: (_b = payload.pushNotificationsEnabled) !== null && _b !== void 0 ? _b : true,
            theme: (_c = payload.theme) !== null && _c !== void 0 ? _c : 'light',
        });
        await this.settingsRepository.save(settings);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfileEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_settings_entity_1.UserSettingsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map