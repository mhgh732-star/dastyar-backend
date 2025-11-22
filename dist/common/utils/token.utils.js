"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.decodeToken = decodeToken;
const jwt = require("jsonwebtoken");
function getEnv(name, fallback) {
    var _a;
    const value = (_a = process.env[name]) !== null && _a !== void 0 ? _a : fallback;
    if (!value)
        throw new Error(`Missing environment variable: ${name}`);
    return value;
}
function signAccessToken(payload, options) {
    const secret = getEnv('JWT_ACCESS_SECRET');
    const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m');
    return jwt.sign({ ...payload, type: 'access' }, secret, { expiresIn, ...(options || {}) });
}
function signRefreshToken(payload, options) {
    const secret = getEnv('JWT_REFRESH_SECRET');
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d');
    return jwt.sign({ ...payload, type: 'refresh' }, secret, { expiresIn, ...(options || {}) });
}
function verifyAccessToken(token) {
    const secret = getEnv('JWT_ACCESS_SECRET');
    return jwt.verify(token, secret);
}
function verifyRefreshToken(token) {
    const secret = getEnv('JWT_REFRESH_SECRET');
    return jwt.verify(token, secret);
}
function decodeToken(token) {
    return jwt.decode(token);
}
//# sourceMappingURL=token.utils.js.map