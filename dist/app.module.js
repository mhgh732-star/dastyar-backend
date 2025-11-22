"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_provider_1 = require("./shared/typeorm.provider");
const sql_migration_runner_1 = require("./shared/sql-migration.runner");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const courses_module_1 = require("./modules/courses/courses.module");
const roles_module_1 = require("./modules/roles/roles.module");
const admin_module_1 = require("./modules/admin/admin.module");
const content_module_1 = require("./modules/content/content.module");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const assignments_module_1 = require("./modules/assignments/assignments.module");
const progress_module_1 = require("./modules/progress/progress.module");
const forum_module_1 = require("./modules/forum/forum.module");
const file_manager_module_1 = require("./modules/file-manager/file-manager.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, typeorm_provider_1.TypeOrmRootModule)(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            roles_module_1.RolesModule,
            admin_module_1.AdminModule,
            content_module_1.ContentModule,
            quiz_module_1.QuizModule,
            assignments_module_1.AssignmentsModule,
            progress_module_1.ProgressModule,
            forum_module_1.ForumModule,
            file_manager_module_1.FileManagerModule,
        ],
        providers: [sql_migration_runner_1.SqlMigrationRunner],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map