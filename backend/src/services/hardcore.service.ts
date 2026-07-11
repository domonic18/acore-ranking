import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { HardcoreRepository } from '../repositories/hardcore.repository';
import { getFactionByRace } from '../shared/utils/faction.util';
import { formatTotalTime } from '../shared/utils/time.util';
import { formatDeathReason } from '../shared/utils/death-reason.util';
import { getZoneName } from '../data/zoneNames';

export class HardcoreService {
  private cache = new CacheService();
  private repo = new HardcoreRepository();

  async getCompleted(level: number): Promise<unknown[]> {
    const cacheKey = CacheKeys.hardcoreCompleted(level);
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findCompletedByLevel(level) as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.character_level,
      side: getFactionByRace(p.race),
      total_spent_time: p.total_spent_time,
      total_spent_time_str: formatTotalTime(p.total_spent_time),
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }

  async getFail(): Promise<unknown[]> {
    const cacheKey = CacheKeys.hardcoreFail;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findFailed() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.character_level,
      side: getFactionByRace(p.race),
      total_spent_time: p.total_spent_time,
      total_spent_time_str: formatTotalTime(p.total_spent_time),
      death_reason: formatDeathReason(p.death_reason, p.killer_info),
      death_location: p.death_location_area_id || p.death_location_zone_id
        ? getZoneName(p.death_location_area_id || p.death_location_zone_id)
        : null,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }

  async getIncomplete(): Promise<unknown[]> {
    const cacheKey = CacheKeys.hardcoreIncomplete;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findIncomplete() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.character_level,
      side: getFactionByRace(p.race),
      total_spent_time: p.total_spent_time,
      total_spent_time_str: formatTotalTime(p.total_spent_time),
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }
}
