import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SessionEntity } from './entities/session.entity';
import { hashPassword, verifyPassword } from '../../common/utils/password.utils';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../common/utils/token.utils';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    @InjectRepository(SessionEntity) private readonly sessions: Repository<SessionEntity>,
  ) {}

  async register(payload: { email: string; firstName: string; lastName: string; password: string; role?: string }) {
    const exists = await this.users.findOne({ where: { email: payload.email } });
    if (exists) {
      throw new UnauthorizedException('Email already registered');
    }
    const user = this.users.create({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      passwordHash: await hashPassword(payload.password),
      roles: [payload.role || 'student'],
    });
    await this.users.save(user);
    const accessToken = signAccessToken({ sub: user.id, email: user.email, roles: user.roles, mfaEnabled: user.mfaEnabled });
    const refreshToken = signRefreshToken({ sub: user.id });
    await this.createSession(user.id, refreshToken);
    return { user: this.publicUser(user), accessToken, refreshToken };
  }

  async login(payload: { email: string; password: string; otp?: string }) {
    const user = await this.users.findOne({ where: { email: payload.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await verifyPassword(payload.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    if (user.mfaEnabled) {
      if (!payload.otp || !user.mfaSecret) throw new UnauthorizedException('MFA code required');
      const isValid = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: payload.otp, window: 1 });
      if (!isValid) throw new UnauthorizedException('Invalid MFA code');
    }
    const accessToken = signAccessToken({ sub: user.id, email: user.email, roles: user.roles, mfaEnabled: user.mfaEnabled });
    const refreshToken = signRefreshToken({ sub: user.id });
    await this.createSession(user.id, refreshToken);
    return { user: this.publicUser(user), accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const session = await this.sessions.findOne({ where: { refreshToken, userId: payload.sub as string, isRevoked: false } });
    if (!session || new Date() > session.expiresAt) throw new UnauthorizedException('Invalid refresh token');
    const user = await this.users.findOne({ where: { id: session.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const accessToken = signAccessToken({ sub: user.id, email: user.email, roles: user.roles, mfaEnabled: user.mfaEnabled });
    const nextRefresh = signRefreshToken({ sub: user.id });
    // rotate
    session.refreshToken = nextRefresh;
    session.expiresAt = this.calcRefreshExpiry();
    await this.sessions.save(session);
    return { accessToken, refreshToken: nextRefresh };
  }

  async logout(refreshToken: string) {
    const session = await this.sessions.findOne({ where: { refreshToken } });
    if (session) {
      session.isRevoked = true;
      await this.sessions.save(session);
    }
    return { success: true };
  }

  async logoutAll(userId: string) {
    await this.sessions.update({ userId }, { isRevoked: true });
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.publicUser(user);
  }

  async enableMfa(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const issuer = process.env.MFA_ISSUER || 'LMS';
    const label = `${issuer}:${user.email}`;
    const secret = speakeasy.generateSecret({ name: label, issuer, length: 20 });
    user.mfaSecret = secret.base32;
    user.mfaEnabled = false; // will enable after successful verify
    await this.users.save(user);
    return { secretBase32: secret.base32, otpauthUrl: secret.otpauth_url };
  }

  async verifyMfa(userId: string, code: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || !user.mfaSecret) throw new UnauthorizedException('MFA not initiated');
    const isValid = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: code, window: 1 });
    if (!isValid) throw new UnauthorizedException('Invalid MFA code');
    user.mfaEnabled = true;
    await this.users.save(user);
    return { verified: true, mfaEnabled: true };
  }

  private async createSession(userId: string, refreshToken: string) {
    const session = this.sessions.create({
      userId,
      refreshToken,
      isRevoked: false,
      expiresAt: this.calcRefreshExpiry(),
    });
    await this.sessions.save(session);
  }

  private calcRefreshExpiry(): Date {
    const days = 7;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  private publicUser(u: UserEntity) {
    return { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, roles: u.roles, mfaEnabled: u.mfaEnabled };
  }
}
