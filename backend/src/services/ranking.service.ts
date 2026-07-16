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

    try {
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
    } catch (err) {
      console.error('[RankingService] getGoldRanking failed:', err);
      return [];
    }
  }

  async getPlaytimeRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topPlaytime;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getPlaytimeRanking failed:', err);
      return [];
    }
  }

  async getHonorRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topHonor;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getHonorRanking failed:', err);
      return [];
    }
  }

  async getKillsRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getKillsRanking failed:', err);
      return [];
    }
  }

  async getDeathRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topDeaths;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopDeathPlayers() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        death_count: Number(p.death_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getDeathRanking failed:', err);
      return [];
    }
  }

  async getMonsterKillRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topMonsterKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopMonsterKillPlayers() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        monster_kill_count: Number(p.monster_kill_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getMonsterKillRanking failed:', err);
      return [];
    }
  }

  async getCritterKillRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topCritterKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopCritterKillPlayers() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        critter_kill_count: Number(p.critter_kill_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getCritterKillRanking failed:', err);
      return [];
    }
  }

  async getFlightPathRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topFlightPaths;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopFlightPathPlayers() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        flight_path_count: Number(p.flight_path_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getFlightPathRanking failed:', err);
      return [];
    }
  }

  async getHealingPotionRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topHealingPotions;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopHealingPotionPlayers() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        healing_potion_count: Number(p.healing_potion_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getHealingPotionRanking failed:', err);
      return [];
    }
  }

  async getDungeon5Ranking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topDungeon5;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopDungeon5Players() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        dungeon_5_count: Number(p.dungeon_5_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getDungeon5Ranking failed:', err);
      return [];
    }
  }

  async getRaid10Ranking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topRaid10;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopRaid10Players() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        raid_10_count: Number(p.raid_10_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getRaid10Ranking failed:', err);
      return [];
    }
  }

  async getRaid25Ranking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topRaid25;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopRaid25Players() as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        raid_25_count: Number(p.raid_25_count) || 0,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error('[RankingService] getRaid25Ranking failed:', err);
      return [];
    }
  }

  async getReputationRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topReputation;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getReputationRanking failed:', err);
      return [];
    }
  }

  async getQuestRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topQuest;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getQuestRanking failed:', err);
      return [];
    }
  }

  async getLegendaryRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topLegendary;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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

      await this.cache.set(cacheKey, result, CacheTTL.daily);
      return result;
    } catch (err) {
      console.error('[RankingService] getLegendaryRanking failed:', err);
      return [];
    }
  }

  async getTodayKillsRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topTodayKills;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getTodayKillsRanking failed:', err);
      return [];
    }
  }

  async getAchievementRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topAchievement;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getAchievementRanking failed:', err);
      return [];
    }
  }

  async getMountRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topMount;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
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
    } catch (err) {
      console.error('[RankingService] getMountRanking failed:', err);
      return [];
    }
  }
}
