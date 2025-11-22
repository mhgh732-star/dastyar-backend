export interface CorsConfig {
  origins: string[];
  allowCredentials: boolean;
}

export const loadCorsConfig = (): CorsConfig => ({
  origins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  allowCredentials: process.env.CORS_ALLOW_CREDENTIALS !== 'false',
});
