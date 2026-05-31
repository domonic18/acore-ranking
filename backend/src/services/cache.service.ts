import { redis } from '../config/redis';

export const CacheKeys = {
  onlineCount: 'online:count',
  onlinePlayers: 'online:players',
  topGold: 'ranking:gold',
  topPlaytime: 'ranking:playtime',
  topMount: 'ranking:mount',
  topHonor: 'ranking:honor',
  topAchievement: 'ranking:achievement',
  hardcoreCompleted: (level: number) => `hardcore:completed:${level}`,
  hardcoreFail: 'hardcore:fail',
  hardcoreIncomplete: 'hardcore:incomplete',
  recentAchieve: 'achievement:recent',
  banlist: 'banlist:recent',
} as const;

export const CacheTTL = {
  realtime: 60,
  short: 300,
  medium: 1800,
} as const;

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttl: number): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch {
      // Redis unavailable — silently skip caching
    }
  }
}
