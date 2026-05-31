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
