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
var SqlMigrationRunner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlMigrationRunner = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path = require("path");
let SqlMigrationRunner = SqlMigrationRunner_1 = class SqlMigrationRunner {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(SqlMigrationRunner_1.name);
    }
    async onModuleInit() {
        if (!process.env.APPLY_SQL_MIGRATIONS || process.env.APPLY_SQL_MIGRATIONS !== 'true') {
            return;
        }
        if (this.dataSource.options.type !== 'postgres') {
            this.logger.log('SQL migration runner is enabled but DB is not Postgres; skipping');
            return;
        }
        const migrationsDir = path.resolve(process.cwd(), '..', 'database', 'migrations');
        if (!fs.existsSync(migrationsDir)) {
            this.logger.warn(`Migrations directory not found: ${migrationsDir}`);
            return;
        }
        const files = fs
            .readdirSync(migrationsDir)
            .filter((f) => f.endsWith('.sql'))
            .sort();
        for (const file of files) {
            const full = path.join(migrationsDir, file);
            const sql = fs.readFileSync(full, 'utf8');
            this.logger.log(`Applying migration: ${file}`);
            await this.dataSource.query(sql);
        }
        this.logger.log('All SQL migrations applied');
    }
};
exports.SqlMigrationRunner = SqlMigrationRunner;
exports.SqlMigrationRunner = SqlMigrationRunner = SqlMigrationRunner_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SqlMigrationRunner);
//# sourceMappingURL=sql-migration.runner.js.map