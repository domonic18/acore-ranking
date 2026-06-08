import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { OnlineRepository } from '../repositories/online.repository';
import { getFactionByRace } from '../shared/utils/faction.util';

export class OnlineService {
  private cache = new CacheService();
  private repo = new OnlineRepository();

  async getOnlineCount(): Promise<Record<string, number>> {
    const cacheKey = CacheKeys.onlineCount;
    const cached = await this.cache.get<Record<string, number>>(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.repo.countOnlinePlayers() as any;
      const data = {
        total_count: parseInt(result?.total_count || 0, 10),
        alliance_count: parseInt(result?.alliance_count || 0, 10),
        horde_count: parseInt(result?.horde_count || 0, 10),
      };

      await this.cache.set(cacheKey, data, CacheTTL.realtime);
      return data;
    } catch (err) {
      console.error('[OnlineService] getOnlineCount failed:', err);
      return { total_count: 0, alliance_count: 0, horde_count: 0 };
    }
  }

  async getOnlinePlayers(): Promise<unknown[]> {
    const cacheKey = CacheKeys.onlinePlayers;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findOnlinePlayers() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
      }));

      await this.cache.set(cacheKey, result, CacheTTL.realtime);
      return result;
    } catch (err) {
      console.error('[OnlineService] getOnlinePlayers failed:', err);
      return [];
    }
  }
}
