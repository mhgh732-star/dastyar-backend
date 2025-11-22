"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRootModule = TypeOrmRootModule;
const typeorm_1 = require("@nestjs/typeorm");
function buildOptions() {
    if (process.env.DATABASE_URL) {
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false,
        };
    }
    const type = (process.env.DB_TYPE || 'sqlite');
    if (type === 'postgres') {
        const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined;
        return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'lms',
            autoLoadEntities: true,
            synchronize: false,
            ssl,
        };
    }
    return {
        type: 'sqlite',
        database: process.env.SQLITE_PATH || 'data.sqlite',
        autoLoadEntities: true,
        synchronize: true,
    };
}
function TypeOrmRootModule() {
    return typeorm_1.TypeOrmModule.forRoot(buildOptions());
}
//# sourceMappingURL=typeorm.provider.js.map