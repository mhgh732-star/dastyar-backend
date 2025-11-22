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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../admin.service");
const settings_service_1 = require("../services/settings.service");
const audit_service_1 = require("../services/audit.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const permission_decorator_1 = require("../../../common/decorators/permission.decorator");
const system_setting_dto_1 = require("../dto/system-setting.dto");
const user_decorator_1 = require("../../../common/decorators/user.decorator");
let AdminController = class AdminController {
    constructor(adminService, settingsService, auditService) {
        this.adminService = adminService;
        this.settingsService = settingsService;
        this.auditService = auditService;
    }
    async stats() {
        return this.adminService.getDashboardStats();
    }
    async getSettings() {
        return this.settingsService.findAll();
    }
    async upsertSetting(dto, userId) {
        return this.settingsService.upsert(dto, userId);
    }
    async audit(page, limit) {
        return this.auditService.list({ page, limit });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)('settings'),
    (0, permission_decorator_1.Permissions)('admin.updateSettings'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_setting_dto_1.UpsertSystemSettingDto, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "upsertSetting", null);
__decorate([
    (0, common_1.Get)('audit'),
    (0, permission_decorator_1.Permissions)('admin.viewAudit'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "audit", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        settings_service_1.SettingsService,
        audit_service_1.AuditService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map