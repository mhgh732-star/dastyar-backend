"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtConfig = getJwtConfig;
function getJwtConfig() {
    const requireEnv = (key, fallback) => {
        var _a;
        const value = (_a = process.env[key]) !== null && _a !== void 0 ? _a : fallback;
        if (!value)
            throw new Error(`Missing environment variable: ${key}`);
        return value;
    };
    return {
        accessTokenSecret: requireEnv('JWT_ACCESS_SECRET', 'dev_access_secret'),
        accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshTokenSecret: requireEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret'),
        refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
}
//# sourceMappingURL=jwt.config.js.map