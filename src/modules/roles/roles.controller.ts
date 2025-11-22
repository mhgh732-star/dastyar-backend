import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionDto, OverridePermissionDto } from './dto/assign-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permission.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async list() {
    return this.rolesService.listRoles();
  }

  @Post()
  @Permissions('roles.create')
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Post(':roleId/permissions')
  @Permissions('roles.assignPermissions')
  async assign(@Param('roleId') roleId: string, @Body() dto: AssignPermissionDto) {
    return this.rolesService.assignPermissions(roleId, dto);
  }

  @Put(':roleId/permissions')
  @Permissions('roles.overridePermissions')
  async override(@Param('roleId') roleId: string, @Body() dto: OverridePermissionDto) {
    return this.rolesService.overridePermissions(roleId, dto);
  }
}

