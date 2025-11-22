"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./controllers/admin.controller");
const admin_service_1 = require("./admin.service");
const settings_service_1 = require("./services/settings.service");
const audit_service_1 = require("./services/audit.service");
const system_setting_entity_1 = require("./entities/system-setting.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const course_entity_1 = require("../courses/entities/course.entity");
const enrollment_entity_1 = require("../courses/entities/enrollment.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([system_setting_entity_1.SystemSettingEntity, audit_log_entity_1.AuditLogEntity, user_entity_1.UserEntity, course_entity_1.CourseEntity, enrollment_entity_1.CourseEnrollmentEntity])],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, settings_service_1.SettingsService, audit_service_1.AuditService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map