import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { RankingRepository } from '../repositories/ranking.repository';
import { getFactionByRace } from '../shared/utils/faction.util';
import { formatTotalTime } from '../shared/utils/time.util';
import { formatGold } from '../shared/utils/gold.util';
import { MOUNT_SPELL_IDS } from '../shared/constants/mount-spell-ids';
import { ITEM_DISPLAY_INFO } from '../generated/itemDisplayInfo';

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

  async getKillsRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopKillsPlayers() as any[];
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
      total_kills: p.totalKills,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getDeathRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topDeaths;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopDeathPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      death_count: p.death_count,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getReputationRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topReputation;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopReputationPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      total_reputation: p.total_reputation,
      exalted_count: p.exalted_count,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getQuestRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topQuest;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopQuestPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      quest_count: p.quest_count,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getLegendaryRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topLegendary;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopLegendaryPlayers() as any[];
    const result = players.map((p) => {
      let items: Array<{ name: string; display_id: number; item_entry: number }> = [];
      if (Array.isArray(p.legendary_items)) {
        items = p.legendary_items;
      } else {
        try {
          items = JSON.parse(p.legendary_items || '[]');
        } catch {
          items = [];
        }
      }
      const legendary_items = items.map((item) => ({
        name: item.name,
        display_id: item.display_id,
        item_entry: item.item_entry,
        icon: ITEM_DISPLAY_INFO[item.display_id] || null,
      }));

      return {
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        legendary_count: Number(p.legendary_count) || 0,
        legendary_items,
      };
    });

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getTodayKillsRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topTodayKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopTodayKillsPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      today_kills: p.todayKills,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getYesterdayKillsRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topYesterdayKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const players = await this.repo.findTopYesterdayKillsPlayers() as any[];
    const result = players.map((p) => ({
      guid: p.guid,
      name: p.name || '已删号',
      race: p.race,
      class: p.class,
      gender: p.gender,
      level: p.level,
      side: getFactionByRace(p.race),
      yesterday_kills: p.yesterdayKills,
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
