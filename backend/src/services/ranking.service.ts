import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { RankingRepository } from '../repositories/ranking.repository';
import { getFactionByRace } from '../shared/utils/faction.util';
import { formatTotalTime } from '../shared/utils/time.util';
import { formatGold } from '../shared/utils/gold.util';
import { MOUNT_SPELL_IDS } from '../shared/constants/mount-spell-ids';

export class RankingService {
  private cache = new CacheService();
  private repo = new RankingRepository();

  async getGoldRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topGold;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopGoldPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      total_gold: p.money,
      total_gold_str: formatGold(p.money),
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getPlaytimeRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topPlaytime;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopPlaytimePlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      total_spent_time: p.totaltime,
      total_spent_time_str: formatTotalTime(p.totaltime),
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getHonorRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topHonor;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopHonorPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      total_time: p.totaltime,
      total_time_str: formatTotalTime(p.totaltime),
      total_honor_points: p.totalHonorPoints,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getAchievementRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topAchievement;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopAchievementPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      total_achieve_points: p.total_achieve_points,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getMountRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topMount;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopMountPlayers(MOUNT_SPELL_IDS) as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      total_mount_counts: p.mount_count,
      mount_ids: p.mount_ids,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }
}
