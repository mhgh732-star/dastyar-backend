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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let RolesService = class RolesService {
    constructor(rolesRepository, permissionsRepository, rolePermissionsRepository, usersRepository) {
        this.rolesRepository = rolesRepository;
        this.permissionsRepository = permissionsRepository;
        this.rolePermissionsRepository = rolePermissionsRepository;
        this.usersRepository = usersRepository;
    }
    async createRole(dto) {
        var _a, _b;
        const exists = await this.rolesRepository.findOne({ where: { name: dto.name } });
        if (exists) {
            throw new common_1.ConflictException('Role already exists');
        }
        const role = this.rolesRepository.create({
            name: dto.name,
            displayName: dto.displayName,
            description: dto.description,
            level: (_a = dto.level) !== null && _a !== void 0 ? _a : 10,
            isSystemRole: (_b = dto.isSystemRole) !== null && _b !== void 0 ? _b : false,
        });
        return this.rolesRepository.save(role);
    }
    async listRoles() {
        return this.rolesRepository.find({ relations: ['permissions', 'permissions.permission'] });
    }
    async assignPermissions(roleId, dto) {
        const role = await this.rolesRepository.findOne({ where: { id: roleId } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        const permissions = await this.ensurePermissions(dto.permissionNames);
        const existing = await this.rolePermissionsRepository.find({
            where: { roleId, permissionId: (0, typeorm_2.In)(permissions.map((p) => p.id)) },
        });
        const existingMap = new Set(existing.map((rp) => rp.permissionId));
        const newEntries = permissions
            .filter((permission) => !existingMap.has(permission.id))
            .map((permission) => this.rolePermissionsRepository.create({ roleId, permissionId: permission.id }));
        await this.rolePermissionsRepository.save(newEntries);
        return this.listRoles();
    }
    async overridePermissions(roleId, dto) {
        var _a;
        const role = await this.rolesRepository.findOne({ where: { id: roleId } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        const permissions = ((_a = dto.permissionNames) === null || _a === void 0 ? void 0 : _a.length) ? await this.ensurePermissions(dto.permissionNames) : [];
        await this.rolePermissionsRepository.delete({ roleId });
        if (permissions.length) {
            const entries = permissions.map((permission) => this.rolePermissionsRepository.create({ roleId, permissionId: permission.id }));
            await this.rolePermissionsRepository.save(entries);
        }
        return this.listRoles();
    }
    async updateUserRoles(userId, roleNames) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.roles = roleNames;
        await this.usersRepository.save(user);
        return user;
    }
    async ensurePermissions(names) {
        const uniqueNames = [...new Set(names)];
        const permissions = await this.permissionsRepository.find({ where: { name: (0, typeorm_2.In)(uniqueNames) } });
        const foundNames = permissions.map((permission) => permission.name);
        const missing = uniqueNames.filter((name) => !foundNames.includes(name));
        if (missing.length) {
            const newPermissions = missing.map((name) => this.permissionsRepository.create({
                name,
                displayName: name.replace(/[:.]/g, ' ').replace(/\s+/g, ' ').trim(),
                resource: name.split('.')[0] || 'general',
                action: name.split('.')[1] || 'view',
            }));
            permissions.push(...(await this.permissionsRepository.save(newPermissions)));
        }
        return permissions;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermissionEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map