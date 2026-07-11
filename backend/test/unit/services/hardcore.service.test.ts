import { HardcoreService } from '../../../src/services/hardcore.service';
import { HardcoreRepository } from '../../../src/repositories/hardcore.repository';
import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';

jest.mock('../../../src/repositories/hardcore.repository');
jest.mock('../../../src/services/cache.service');

describe('HardcoreService', () => {
  let service: HardcoreService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HardcoreService();
  });

  function mockCacheMiss() {
    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);
    return cacheInstance;
  }

  function mockRepo() {
    return (HardcoreRepository as jest.Mock).mock.instances[0];
  }

  describe('getCompleted', () => {
    it('uses dynamic cache key based on level', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findCompletedByLevel.mockResolvedValue([
        { guid: 1, name: 'Hero', race: 1, class: 1, gender: 0, character_level: 60, total_spent_time: 3600 },
      ]);

      const result = await service.getCompleted(60);

      expect(cache.get).toHaveBeenCalledWith(CacheKeys.hardcoreCompleted(60));
      expect(cache.set).toHaveBeenCalledWith(
        CacheKeys.hardcoreCompleted(60),
        expect.any(Array),
        CacheTTL.medium,
      );
      expect((result as any)[0]).toMatchObject({
        level: 60,
        side: 0,
        total_spent_time_str: '0 天 1 小时 0 分钟',
      });
    });
  });

  describe('getFail', () => {
    it('returns failed players ordered by latest', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findFailed.mockResolvedValue([
        { guid: 1, name: 'Dead', race: 2, class: 2, gender: 1, character_level: 45, total_spent_time: 1800, death_reason: 'creature', death_location_zone_id: 12, death_location_area_id: 87, killer_info: 'creature:686:Lashtail Raptor:level35' },
      ]);

      const result = await service.getFail();

      expect(cache.get).toHaveBeenCalledWith(CacheKeys.hardcoreFail);
      expect((result as any)[0]).toMatchObject({
        name: 'Dead',
        side: 1,
        level: 45,
        death_reason: '被怪物 Lashtail Raptor (等级 35) 击杀',
        death_location: '闪金镇',
      });
    });

    it('hides legacy placeholder death values', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findFailed.mockResolvedValue([
        { guid: 2, name: 'Legacy', race: 1, class: 1, gender: 0, character_level: 10, total_spent_time: 600, death_reason: 'death', death_location_zone_id: 0, death_location_area_id: 0, killer_info: null },
      ]);

      const result = await service.getFail();

      expect((result as any)[0].death_reason).toBeNull();
      expect((result as any)[0].death_location).toBeNull();
    });
  });

  describe('getIncomplete', () => {
    it('returns incomplete hardcore players', async () => {
      const cache = mockCacheMiss();
      const repo = mockRepo();
      repo.findIncomplete.mockResolvedValue([
        { guid: 1, name: '', race: 3, class: 3, gender: 0, character_level: 55, total_spent_time: 7200 },
      ]);

      const result = await service.getIncomplete();

      expect((result as any)[0].name).toBe('已删号');
      expect((result as any)[0].side).toBe(0);
    });
  });
});
