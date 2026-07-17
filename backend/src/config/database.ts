import { DataSource } from 'typeorm';
import { join } from 'path';
import { env, dbConn } from './env';
import { logger } from '../middleware/request-logger';

const commonConfig = {
  type: 'mysql' as const,
  host: dbConn.host,
  port: dbConn.port,
  username: dbConn.user,
  password: dbConn.pass,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
};

export const authDataSource = new DataSource({
  ...commonConfig,
  database: env.DB_AUTH,
  entities: [join(__dirname, '..', 'entities', 'auth', '*.entity.{js,ts}')],
});

export const charactersDataSource = new DataSource({
  ...commonConfig,
  database: env.DB_CHARACTERS,
  entities: [join(__dirname, '..', 'entities', 'characters', '*.entity.{js,ts}')],
});

export const worldDataSource = new DataSource({
  ...commonConfig,
  database: env.DB_WORLD,
  entities: [join(__dirname, '..', 'entities', 'world', '*.entity.{js,ts}')],
});

let dataSourcesInitialized = false;
let isInitializing = false;

export function areDataSourcesReady(): boolean {
  return dataSourcesInitialized;
}

// 等待数据库就绪（有界等待）：SCF 冷启动期间请求挂起等待初始化完成，避免直接 503
export function waitForDataSourcesReady(timeoutMs: number): Promise<boolean> {
  if (dataSourcesInitialized) return Promise.resolve(true);

  if (!isInitializing) {
    initializeDataSourcesWithRetry().catch(() => {
      startPeriodicRetry();
    });
  }

  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const timer = setInterval(() => {
      if (dataSourcesInitialized) {
        clearInterval(timer);
        resolve(true);
      } else if (Date.now() >= deadline) {
        clearInterval(timer);
        resolve(false);
      }
    }, 200);
    timer.unref();
  });
}

async function resetDataSources(): Promise<void> {
  dataSourcesInitialized = false;
  try {
    if (authDataSource.isInitialized) await authDataSource.destroy();
  } catch {
    // ignore
  }
  try {
    if (charactersDataSource.isInitialized) await charactersDataSource.destroy();
  } catch {
    // ignore
  }
  try {
    if (worldDataSource.isInitialized) await worldDataSource.destroy();
  } catch {
    // ignore
  }
}

export async function initializeDataSources(): Promise<void> {
  await Promise.all([
    authDataSource.initialize(),
    charactersDataSource.initialize(),
    worldDataSource.initialize(),
  ]);
  dataSourcesInitialized = true;
}

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;
const PERIODIC_RETRY_MS = 30000;

let periodicRetryTimer: ReturnType<typeof setInterval> | null = null;

export function stopPeriodicRetry(): void {
  if (periodicRetryTimer) {
    clearInterval(periodicRetryTimer);
    periodicRetryTimer = null;
  }
}

async function tryInitializeOnce(): Promise<boolean> {
  if (isInitializing) return false;
  isInitializing = true;
  try {
    await resetDataSources();
    await initializeDataSources();
    logger.info('Database connections established / 数据库连接已建立');
    stopPeriodicRetry();
    return true;
  } catch (err) {
    // Use error level so it shows up in SCF logs regardless of LOG_LEVEL filter
    logger.error(
      err,
      'Periodic database retry failed / 定时数据库重试失败',
    );
    return false;
  } finally {
    isInitializing = false;
  }
}

export function startPeriodicRetry(): void {
  if (periodicRetryTimer) return;
  periodicRetryTimer = setInterval(() => {
    if (!dataSourcesInitialized) {
      tryInitializeOnce();
    }
  }, PERIODIC_RETRY_MS);
}

export async function initializeDataSourcesWithRetry(): Promise<void> {
  if (isInitializing) return;
  isInitializing = true;

  try {
    await resetDataSources();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await initializeDataSources();
        logger.info('Database connections established / 数据库连接已建立');
        stopPeriodicRetry();
        return;
      } catch (err) {
        logger.error(
          err,
          `Database connection failed (attempt ${attempt}/${MAX_RETRIES}) / 数据库连接失败（第${attempt}/${MAX_RETRIES}次尝试）`,
        );
        if (attempt === MAX_RETRIES) {
          logger.error(
            err,
            'Database connection exhausted all retries, starting periodic retry / 数据库连接已用尽所有重试次数，启动定时重试',
          );
          startPeriodicRetry();
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  } finally {
    isInitializing = false;
  }
}
