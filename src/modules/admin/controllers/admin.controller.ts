import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { SettingsService } from '../services/settings.service';
import { AuditService } from '../services/audit.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permission.decorator';
import { UpsertSystemSettingDto } from '../dto/system-setting.dto';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly settingsService: SettingsService,
    private readonly auditService: AuditService,
  ) {}

  @Get('stats')
  async stats() {
    return this.adminService.getDashboardStats();
  }

  @Get('settings')
  async getSettings() {
    return this.settingsService.findAll();
  }

  @Post('settings')
  @Permissions('admin.updateSettings')
  async upsertSetting(@Body() dto: UpsertSystemSettingDto, @CurrentUser('userId') userId: string) {
    return this.settingsService.upsert(dto, userId);
  }

  @Get('audit')
  @Permissions('admin.viewAudit')
  async audit(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.auditService.list({ page, limit });
  }
}
