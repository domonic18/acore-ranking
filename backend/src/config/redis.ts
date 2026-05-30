import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('Redis connection error / Redis 连接错误:', err.message);
});

export { redis };
