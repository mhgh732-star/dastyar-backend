import * as jwt from 'jsonwebtoken';

export type JwtPayload = Record<string, any> & {
  sub?: string;
  type?: 'access' | 'refresh';
};

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function signAccessToken(payload: JwtPayload, options?: jwt.SignOptions): string {
  const secret = getEnv('JWT_ACCESS_SECRET');
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any;
  return jwt.sign({ ...payload, type: 'access' }, secret, { expiresIn, ...(options || {}) } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtPayload, options?: jwt.SignOptions): string {
  const secret = getEnv('JWT_REFRESH_SECRET');
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any;
  return jwt.sign({ ...payload, type: 'refresh' }, secret, { expiresIn, ...(options || {}) } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = getEnv('JWT_ACCESS_SECRET');
  return jwt.verify(token, secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const secret = getEnv('JWT_REFRESH_SECRET');
  return jwt.verify(token, secret) as JwtPayload;
}

export function decodeToken(token: string): null | JwtPayload {
  return jwt.decode(token) as JwtPayload | null;
}
