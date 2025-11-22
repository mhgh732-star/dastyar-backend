import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionDto, OverridePermissionDto } from './dto/assign-permission.dto';
import { UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity) private readonly rolesRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity) private readonly permissionsRepository: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepository: Repository<RolePermissionEntity>,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const exists = await this.rolesRepository.findOne({ where: { name: dto.name } });
    if (exists) {
      throw new ConflictException('Role already exists');
    }
    const role = this.rolesRepository.create({
      name: dto.name,
      displayName: dto.displayName,
      description: dto.description,
      level: dto.level ?? 10,
      isSystemRole: dto.isSystemRole ?? false,
    });
    return this.rolesRepository.save(role);
  }

  async listRoles() {
    return this.rolesRepository.find({ relations: ['permissions', 'permissions.permission'] });
  }

  async assignPermissions(roleId: string, dto: AssignPermissionDto) {
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');
    const permissions = await this.ensurePermissions(dto.permissionNames);
    const existing = await this.rolePermissionsRepository.find({
      where: { roleId, permissionId: In(permissions.map((p) => p.id)) },
    });
    const existingMap = new Set(existing.map((rp) => rp.permissionId));

    const newEntries = permissions
      .filter((permission) => !existingMap.has(permission.id))
      .map((permission) => this.rolePermissionsRepository.create({ roleId, permissionId: permission.id }));
    await this.rolePermissionsRepository.save(newEntries);
    return this.listRoles();
  }

  async overridePermissions(roleId: string, dto: OverridePermissionDto) {
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const permissions = dto.permissionNames?.length ? await this.ensurePermissions(dto.permissionNames) : [];
    await this.rolePermissionsRepository.delete({ roleId });

    if (permissions.length) {
      const entries = permissions.map((permission) =>
        this.rolePermissionsRepository.create({ roleId, permissionId: permission.id }),
      );
      await this.rolePermissionsRepository.save(entries);
    }
    return this.listRoles();
  }

  async updateUserRoles(userId: string, roleNames: string[]) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.roles = roleNames;
    await this.usersRepository.save(user);
    return user;
  }

  private async ensurePermissions(names: string[]) {
    const uniqueNames = [...new Set(names)];
    const permissions = await this.permissionsRepository.find({ where: { name: In(uniqueNames) } });
    const foundNames = permissions.map((permission) => permission.name);
    const missing = uniqueNames.filter((name) => !foundNames.includes(name));
    if (missing.length) {
      const newPermissions = missing.map((name) =>
        this.permissionsRepository.create({
          name,
          displayName: name.replace(/[:.]/g, ' ').replace(/\s+/g, ' ').trim(),
          resource: name.split('.')[0] || 'general',
          action: name.split('.')[1] || 'view',
        }),
      );
      permissions.push(...(await this.permissionsRepository.save(newPermissions)));
    }
    return permissions;
  }
}

