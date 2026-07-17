import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { RankingRepository } from '../repositories/ranking.repository';
import { getFactionByRace } from '../shared/utils/faction.util';
import { formatTotalTime } from '../shared/utils/time.util';
import { formatGold } from '../shared/utils/gold.util';
import { MOUNT_SPELL_IDS } from '../shared/constants/mount-spell-ids';
import { RARE_ITEM_ENTRIES } from '../shared/constants/rare-items';
import { ITEM_DISPLAY_INFO } from '../generated/itemDisplayInfo';

const ACHIEVEMENT_PROGRESS_RANKINGS = {
  deaths: { cacheKey: CacheKeys.topDeaths, criteriaId: 111, countField: 'death_count' },
  monsterKills: { cacheKey: CacheKeys.topMonsterKills, criteriaId: 4948, countField: 'monster_kill_count' },
  critterKills: { cacheKey: CacheKeys.topCritterKills, criteriaId: 4958, countField: 'critter_kill_count' },
  flightPaths: { cacheKey: CacheKeys.topFlightPaths, criteriaId: 5305, countField: 'flight_path_count' },
  healingPotions: { cacheKey: CacheKeys.topHealingPotions, criteriaId: 4299, countField: 'healing_potion_count' },
  dungeon5: { cacheKey: CacheKeys.topDungeon5, criteriaId: 4987, countField: 'dungeon_5_count' },
  raid10: { cacheKey: CacheKeys.topRaid10, criteriaId: 4988, countField: 'raid_10_count' },
  raid25: { cacheKey: CacheKeys.topRaid25, criteriaId: 4989, countField: 'raid_25_count' },
} as const;

type AchievementProgressRankingKey = keyof typeof ACHIEVEMENT_PROGRESS_RANKINGS;

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

  private async getAchievementProgressRanking(
    key: AchievementProgressRankingKey,
  ): Promise<unknown[]> {
    const config = ACHIEVEMENT_PROGRESS_RANKINGS[key];
    const cached = await this.cache.get<unknown[]>(config.cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopByAchievementCriteria(
        config.criteriaId,
        config.countField,
      ) as any[];
      const result = players.map((p) => ({
        guid: p.guid,
        name: p.name || '已删号',
        race: p.race,
        class: p.class,
        gender: p.gender,
        level: p.level,
        side: getFactionByRace(p.race),
        [config.countField]: Number(p[config.countField]) || 0,
      }));

      await this.cache.set(config.cacheKey, result, CacheTTL.short);
      return result;
    } catch (err) {
      console.error(`[RankingService] getAchievementProgressRanking(${key}) failed:`, err);
      return [];
    }
  }

  async getDeathRanking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('deaths');
  }

  async getMonsterKillRanking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('monsterKills');
  }

  async getCritterKillRanking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('critterKills');
  }

  async getFlightPathRanking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('flightPaths');
  }

  async getHealingPotionRanking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('healingPotions');
  }

  async getDungeon5Ranking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('dungeon5');
  }

  async getRaid10Ranking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('raid10');
  }

  async getRaid25Ranking(): Promise<unknown[]> {
    return this.getAchievementProgressRanking('raid25');
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

  async getRareItemRanking(): Promise<unknown[]> {
    const cacheKey = CacheKeys.topRareItems;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const players = await this.repo.findTopRareItemPlayers(
        RARE_ITEM_ENTRIES,
      ) as any[];
      const result = players.map((p) => {
        let items: Array<{ name: string; display_id: number; item_entry: number }> = [];
        if (Array.isArray(p.rare_items)) {
          items = p.rare_items;
        } else {
          try {
            items = JSON.parse(p.rare_items || '[]');
          } catch {
            items = [];
          }
        }
        const rare_items = items.map((item) => ({
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
          rare_item_count: Number(p.rare_item_count) || 0,
          rare_items,
        };
      });

      await this.cache.set(cacheKey, result, CacheTTL.daily);
      return result;
    } catch (err) {
      console.error('[RankingService] getRareItemRanking failed:', err);
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
