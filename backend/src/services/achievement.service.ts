import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { AchievementRepository } from '../repositories/achievement.repository';

export class AchievementService {
  private cache = new CacheService();
  private repo = new AchievementRepository();

  async getRecent(): Promise<unknown[]> {
    const cacheKey = CacheKeys.recentAchieve;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const achievements = await this.repo.findRecent() as any[];
    const result = achievements.map((a) => ({
      guid: a.guid,
      name: a.name || '已删号',
      race: a.race,
      class: a.class,
      gender: a.gender,
      level: a.level,
      achievement_description: a.achievement_description,
      achievement_date: a.achievement_date,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }
}
