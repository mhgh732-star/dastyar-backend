"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDatabaseConfig = void 0;
const loadDatabaseConfig = () => {
    if (process.env.DATABASE_URL) {
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            database: '',
            synchronize: false,
        };
    }
    if ((process.env.DB_TYPE || 'sqlite') === 'postgres') {
        return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'lms',
            synchronize: false,
            ssl: process.env.DB_SSL === 'true',
        };
    }
    return {
        type: 'sqlite',
        database: process.env.SQLITE_PATH || 'data.sqlite',
        synchronize: true,
    };
};
exports.loadDatabaseConfig = loadDatabaseConfig;
//# sourceMappingURL=database.config.js.map