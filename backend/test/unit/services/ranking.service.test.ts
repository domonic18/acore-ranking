import { RankingService } from '../../../src/services/ranking.service';
import { RankingRepository } from '../../../src/repositories/ranking.repository';
import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';
import { MOUNT_SPELL_IDS } from '../../../src/shared/constants/mount-spell-ids';

jest.mock('../../../src/repositories/ranking.repository');
jest.mock('../../../src/services/cache.service');

describe('RankingService', () => {
  let service: RankingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RankingService();
  });

  function mockCacheMiss() {
    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);
    return cacheInstance;
  }

  function mockRepo() {
    return (RankingRepository as jest.Mock).mock.instances[0];
  }

  describe('getGoldRanking', () => {
    it('formats gold and faction correctly', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopGoldPlayers.mockResolvedValue([
        { guid: 1, name: 'Rich', race: 1, class: 1, gender: 0, level: 80, money: 12345678 },
      ]);

      const result = await service.getGoldRanking();

      expect((result as any)[0]).toMatchObject({
        guid: 1,
        name: 'Rich',
        side: 0,
        total_gold: 12345678,
        total_gold_str: '1234金56银78铜',
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topGold, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getPlaytimeRanking', () => {
    it('formats playtime correctly', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopPlaytimePlayers.mockResolvedValue([
        { guid: 1, name: 'Addicted', race: 2, class: 2, gender: 1, level: 80, totaltime: 90061 },
      ]);

      const result = await service.getPlaytimeRanking();

      expect((result as any)[0]).toMatchObject({
        side: 1,
        total_spent_time: 90061,
        total_spent_time_str: '1 天 1 小时 1 分钟',
      });
    });
  });

  describe('getHonorRanking', () => {
    it('includes honor fields', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopHonorPlayers.mockResolvedValue([
        { guid: 1, name: 'Killer', race: 1, class: 1, gender: 0, level: 80, totaltime: 3600, totalHonorPoints: 5000 },
      ]);

      const result = await service.getHonorRanking();

      expect((result as any)[0]).toMatchObject({
        total_honor_points: 5000,
        total_time_str: '0 天 1 小时 0 分钟',
      });
    });
  });

  describe('getKillsRanking', () => {
    it('includes kill fields', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopKillsPlayers.mockResolvedValue([
        { guid: 1, name: 'Killer', race: 1, class: 1, gender: 0, level: 80, totaltime: 3600, totalKills: 9999 },
      ]);

      const result = await service.getKillsRanking();

      expect((result as any)[0]).toMatchObject({
        total_kills: 9999,
        total_time_str: '0 天 1 小时 0 分钟',
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topKills, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getDeathRanking', () => {
    it('includes death count', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopDeathPlayers.mockResolvedValue([
        { guid: 1, name: 'Unlucky', race: 1, class: 1, gender: 0, level: 80, death_count: 42 },
      ]);

      const result = await service.getDeathRanking();

      expect((result as any)[0]).toMatchObject({
        death_count: 42,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topDeaths, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getMonsterKillRanking', () => {
    it('includes monster kill count', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopMonsterKillPlayers.mockResolvedValue([
        { guid: 1, name: 'Hunter', race: 1, class: 1, gender: 0, level: 80, monster_kill_count: 12345 },
      ]);

      const result = await service.getMonsterKillRanking();

      expect((result as any)[0]).toMatchObject({
        monster_kill_count: 12345,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topMonsterKills, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getCritterKillRanking', () => {
    it('includes critter kill count', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopCritterKillPlayers.mockResolvedValue([
        { guid: 1, name: 'Cruel', race: 1, class: 1, gender: 0, level: 80, critter_kill_count: 999 },
      ]);

      const result = await service.getCritterKillRanking();

      expect((result as any)[0]).toMatchObject({
        critter_kill_count: 999,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topCritterKills, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getFlightPathRanking', () => {
    it('includes flight path count', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopFlightPathPlayers.mockResolvedValue([
        { guid: 1, name: 'Traveler', race: 1, class: 1, gender: 0, level: 80, flight_path_count: 888 },
      ]);

      const result = await service.getFlightPathRanking();

      expect((result as any)[0]).toMatchObject({
        flight_path_count: 888,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topFlightPaths, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getHealingPotionRanking', () => {
    it('includes healing potion count', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopHealingPotionPlayers.mockResolvedValue([
        { guid: 1, name: 'Healer', race: 1, class: 1, gender: 0, level: 80, healing_potion_count: 777 },
      ]);

      const result = await service.getHealingPotionRanking();

      expect((result as any)[0]).toMatchObject({
        healing_potion_count: 777,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topHealingPotions, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getReputationRanking', () => {
    it('includes reputation fields', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopReputationPlayers.mockResolvedValue([
        { guid: 1, name: 'Loved', race: 1, class: 1, gender: 0, level: 80, total_reputation: 999999, exalted_count: 42 },
      ]);

      const result = await service.getReputationRanking();

      expect((result as any)[0]).toMatchObject({
        total_reputation: 999999,
        exalted_count: 42,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topReputation, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getQuestRanking', () => {
    it('includes quest count', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopQuestPlayers.mockResolvedValue([
        { guid: 1, name: 'Questy', race: 1, class: 1, gender: 0, level: 80, quest_count: 3000 },
      ]);

      const result = await service.getQuestRanking();

      expect((result as any)[0]).toMatchObject({
        quest_count: 3000,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topQuest, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getLegendaryRanking', () => {
    it('parses legendary_items JSON and maps icons', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopLegendaryPlayers.mockResolvedValue([
        {
          guid: 1, name: 'Legend', race: 1, class: 1, gender: 0, level: 80, legendary_count: 2,
          legendary_items: JSON.stringify([
            { name: 'Ashbringer', display_id: 1, item_entry: 17182 },
            { name: 'Sulfuras', display_id: 2, item_entry: 17193 },
          ]),
        },
      ]);

      const result = await service.getLegendaryRanking();

      expect((result as any)[0]).toMatchObject({
        legendary_count: 2,
        legendary_items: [
          { name: 'Ashbringer', display_id: 1, item_entry: 17182, icon: null },
          { name: 'Sulfuras', display_id: 2, item_entry: 17193, icon: null },
        ],
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topLegendary, expect.any(Array), CacheTTL.daily);
    });
  });

  describe('getTodayKillsRanking', () => {
    it('includes today kills', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopTodayKillsPlayers.mockResolvedValue([
        { guid: 1, name: 'Slayer', race: 1, class: 1, gender: 0, level: 80, todayKills: 50 },
      ]);

      const result = await service.getTodayKillsRanking();

      expect((result as any)[0]).toMatchObject({
        today_kills: 50,
      });
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topTodayKills, expect.any(Array), CacheTTL.short);
    });
  });

  describe('getAchievementRanking', () => {
    it('maps achievement points', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopAchievementPlayers.mockResolvedValue([
        { guid: 1, name: 'Achiever', race: 1, class: 1, gender: 0, level: 80, total_achieve_points: 1500 },
      ]);

      const result = await service.getAchievementRanking();

      expect((result as any)[0]).toMatchObject({
        total_achieve_points: 1500,
      });
    });
  });

  describe('getMountRanking', () => {
    it('returns mapped results with configured mount IDs', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findTopMountPlayers.mockResolvedValue([
        { guid: 1, name: 'Rider', race: 1, class: 1, gender: 0, level: 80, mount_count: 5, mount_ids: '458,459' },
      ]);

      const result = await service.getMountRanking();

      expect((result as any)[0]).toMatchObject({
        guid: 1,
        name: 'Rider',
        total_mount_counts: 5,
        mount_ids: '458,459',
      });
      expect(repo.findTopMountPlayers).toHaveBeenCalledWith(MOUNT_SPELL_IDS);
      expect(cache.set).toHaveBeenCalledWith(CacheKeys.topMount, expect.any(Array), CacheTTL.short);
    });
  });
});
