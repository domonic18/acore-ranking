/**
 * Centralized environment variable validation and loading.
 * Provides type-safe access to all environment variables with sensible defaults.
 * Supports both connection-string and split-field styles.
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

interface MysqlConn {
  host: string;
  port: number;
  user: string;
  pass: string;
}

function parseMysqlUrl(url?: string): MysqlConn | null {
  if (!url) return null;
  // mysql://user:pass@host:port
  const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+)(?::(\d+))?\/?$/i);
  if (!m) return null;
  return {
    user: decodeURIComponent(m[1]),
    pass: decodeURIComponent(m[2]),
    host: m[3],
    port: m[4] ? parseInt(m[4], 10) : 3306,
  };
}

interface RedisConn {
  host: string;
  port: number;
  password: string;
  db: number;
}

function parseRedisUrl(url?: string): RedisConn | null {
  if (!url) return null;
  // redis://[:password@]host[:port][/db]
  const m = url.match(/^redis:\/\/(?::([^@]*)@)?([^:/]+)(?::(\d+))?(?:\/(\d+))?\/?$/i);
  if (!m) return null;
  return {
    host: m[2],
    port: m[3] ? parseInt(m[3], 10) : 6379,
    password: m[1] ? decodeURIComponent(m[1]) : '',
    db: m[4] ? parseInt(m[4], 10) : 0,
  };
}

const dbUrl = parseMysqlUrl(process.env.DB_URL);
const redisUrl = parseRedisUrl(process.env.REDIS_URL);

export const env = {
  // Application
  NODE_ENV: getEnv('NODE_ENV', 'production'),
  PORT: getEnvInt('PORT', 9000),
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),

  // Database
  DB_HOST: dbUrl?.host ?? getEnv('DB_HOST', '127.0.0.1'),
  DB_PORT: dbUrl?.port ?? getEnvInt('DB_PORT', 3306),
  DB_USER: dbUrl?.user ?? getEnv('DB_USER', 'acore'),
  DB_PASS: dbUrl?.pass ?? getEnv('DB_PASS', 'acore'),
  DB_AUTH: getEnv('DB_AUTH', 'acore_auth'),
  DB_CHARACTERS: getEnv('DB_CHARACTERS', 'acore_characters'),
  DB_WORLD: getEnv('DB_WORLD', 'acore_world'),

  // Redis
  REDIS_HOST: redisUrl?.host ?? getEnv('REDIS_HOST', '127.0.0.1'),
  REDIS_PORT: redisUrl?.port ?? getEnvInt('REDIS_PORT', 6379),
  REDIS_PASSWORD: redisUrl?.password ?? getEnv('REDIS_PASSWORD', ''),
  REDIS_DB: redisUrl?.db ?? getEnvInt('REDIS_DB', 0),
  REDIS_EXPIRE_TIME: getEnvInt('REDIS_EXPIRE_TIME', 300),

  // CORS / iframe
  ALLOWED_ORIGINS: getEnv('ALLOWED_ORIGINS', '*'),

  // External links
  SITE_URL: getEnv('SITE_URL', 'http://localhost/web-api/'),
  ARMORY_BASE_URL: getEnv('ARMORY_BASE_URL', ''),
  SERVER_NAME: getEnv('SERVER_NAME', ''),

  // Widget links
  WIDGET_DETAIL_URL: getEnv('WIDGET_DETAIL_URL', 'http://lokta.cn/?page_id=135'),
  WIDGET_ONLINE_URL: getEnv('WIDGET_ONLINE_URL', 'http://lokta.cn/?page_id=1897'),

  // Achievement
  RECENT_ACHIEVEMENT_LIMIT: getEnvInt('RECENT_ACHIEVEMENT_LIMIT', 50),
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
