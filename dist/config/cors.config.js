"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCorsConfig = void 0;
const loadCorsConfig = () => ({
    origins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
    allowCredentials: process.env.CORS_ALLOW_CREDENTIALS !== 'false',
});
exports.loadCorsConfig = loadCorsConfig;
//# sourceMappingURL=cors.config.js.map