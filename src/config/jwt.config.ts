export interface JwtModuleConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}

export function getJwtConfig(): JwtModuleConfig {
  const requireEnv = (key: string, fallback?: string) => {
    const value = process.env[key] ?? fallback;
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
  };

  return {
    accessTokenSecret: requireEnv('JWT_ACCESS_SECRET', 'dev_access_secret'),
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshTokenSecret: requireEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret'),
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
}
