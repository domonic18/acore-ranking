/**
 * Centralized environment variable validation and loading.
 * Provides type-safe access to all environment variables with sensible defaults.
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvInt(key: string, defaultValue?: number): number {
  const raw = process.env[key];
  if (raw === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid integer, got: ${raw}`);
  }
  return parsed;
}

export const env = {
  // Application
  NODE_ENV: getEnv('NODE_ENV', 'production'),
  PORT: getEnvInt('PORT', 9000),
  API_KEY: getEnv('API_KEY', ''),
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),

  // Database
  DB_HOST: getEnv('DB_HOST', '127.0.0.1'),
  DB_PORT: getEnvInt('DB_PORT', 3306),
  DB_USER: getEnv('DB_USER', 'acore'),
  DB_PASS: getEnv('DB_PASS', 'acore'),
  DB_AUTH: getEnv('DB_AUTH', 'acore_auth'),
  DB_CHARACTERS: getEnv('DB_CHARACTERS', 'acore_characters'),
  DB_WORLD: getEnv('DB_WORLD', 'acore_world'),

  // Redis
  REDIS_HOST: getEnv('REDIS_HOST', '127.0.0.1'),
  REDIS_PORT: getEnvInt('REDIS_PORT', 6379),
  REDIS_PASSWORD: getEnv('REDIS_PASSWORD', ''),
  REDIS_EXPIRE_TIME: getEnvInt('REDIS_EXPIRE_TIME', 300),

  // CORS / iframe
  ALLOWED_ORIGINS: getEnv('ALLOWED_ORIGINS', '*'),

  // External links
  SITE_URL: getEnv('SITE_URL', 'http://localhost/web-api/'),
  ARMORY_BASE_URL: getEnv('ARMORY_BASE_URL', ''),
  SERVER_NAME: getEnv('SERVER_NAME', ''),
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
