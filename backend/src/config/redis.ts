import Redis from 'ioredis';
import { env } from './env';

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: 0,
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 0,
});

redis.on('error', (err) => {
  // Silently ignore connection errors in production (e.g. SCF without Redis)
  if (env.NODE_ENV === 'development') {
    console.error('Redis connection error / Redis 连接错误:', err.message);
  }
});

export { redis };
