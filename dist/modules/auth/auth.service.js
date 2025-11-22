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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const session_entity_1 = require("./entities/session.entity");
const password_utils_1 = require("../../common/utils/password.utils");
const token_utils_1 = require("../../common/utils/token.utils");
const speakeasy = require("speakeasy");
let AuthService = class AuthService {
    constructor(users, sessions) {
        this.users = users;
        this.sessions = sessions;
    }
    async register(payload) {
        const exists = await this.users.findOne({ where: { email: payload.email } });
        if (exists) {
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const user = this.users.create({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            passwordHash: await (0, password_utils_1.hashPassword)(payload.password),
            roles: [payload.role || 'student'],
        });
        await this.users.save(user);
        const accessToken = (0, token_utils_1.signAccessToken)({ sub: user.id, email: user.email, roles: user.roles, mfaEnabled: user.mfaEnabled });
        const refreshToken = (0, token_utils_1.signRefreshToken)({ sub: user.id });
        await this.createSession(user.id, refreshToken);
        return { user: this.publicUser(user), accessToken, refreshToken };
    }
    async login(payload) {
        const user = await this.users.findOne({ where: { email: payload.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await (0, password_utils_1.verifyPassword)(payload.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.mfaEnabled) {
            if (!payload.otp || !user.mfaSecret)
                throw new common_1.UnauthorizedException('MFA code required');
            const isValid = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: payload.otp, window: 1 });
            if (!isValid)
                throw new common_1.UnauthorizedException('Invalid MFA code');
        }
        const accessToken = (0, token_utils_1.signAccessToken)({ sub: user.id, email: user.email, roles: user.roles, mfaEnabled: user.mfaEnabled });
        const refreshToken = (0, token_utils_1.signRefreshToken)({ sub: user.id });
        await this.createSession(user.id, refreshToken);
        return { user: this.publicUser(user), accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        const payload = (0, token_utils_1.verifyRefreshToken)(refreshToken);
        const session = await this.sessions.findOne({ where: { refreshToken, userId: payload.sub, isRevoked: false } });
        if (!session || new Date() > session.expiresAt)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const user = await this.users.findOne({ where: { id: session.userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const accessToken = (0, token_utils_1.signAccessToken)({ sub: user.id, email: user.email, roles: user.roles, mfaEnabled: user.mfaEnabled });
        const nextRefresh = (0, token_utils_1.signRefreshToken)({ sub: user.id });
        session.refreshToken = nextRefresh;
        session.expiresAt = this.calcRefreshExpiry();
        await this.sessions.save(session);
        return { accessToken, refreshToken: nextRefresh };
    }
    async logout(refreshToken) {
        const session = await this.sessions.findOne({ where: { refreshToken } });
        if (session) {
            session.isRevoked = true;
            await this.sessions.save(session);
        }
        return { success: true };
    }
    async logoutAll(userId) {
        await this.sessions.update({ userId }, { isRevoked: true });
        return { success: true };
    }
    async me(userId) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.publicUser(user);
    }
    async enableMfa(userId) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const issuer = process.env.MFA_ISSUER || 'LMS';
        const label = `${issuer}:${user.email}`;
        const secret = speakeasy.generateSecret({ name: label, issuer, length: 20 });
        user.mfaSecret = secret.base32;
        user.mfaEnabled = false;
        await this.users.save(user);
        return { secretBase32: secret.base32, otpauthUrl: secret.otpauth_url };
    }
    async verifyMfa(userId, code) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user || !user.mfaSecret)
            throw new common_1.UnauthorizedException('MFA not initiated');
        const isValid = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: code, window: 1 });
        if (!isValid)
            throw new common_1.UnauthorizedException('Invalid MFA code');
        user.mfaEnabled = true;
        await this.users.save(user);
        return { verified: true, mfaEnabled: true };
    }
    async createSession(userId, refreshToken) {
        const session = this.sessions.create({
            userId,
            refreshToken,
            isRevoked: false,
            expiresAt: this.calcRefreshExpiry(),
        });
        await this.sessions.save(session);
    }
    calcRefreshExpiry() {
        const days = 7;
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d;
    }
    publicUser(u) {
        return { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, roles: u.roles, mfaEnabled: u.mfaEnabled };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(session_entity_1.SessionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map