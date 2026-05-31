import { CharacterService } from '../../../src/services/character.service';
import { CharacterRepository } from '../../../src/repositories/character.repository';
import { CacheService, CacheTTL } from '../../../src/services/cache.service';

jest.mock('../../../src/repositories/character.repository');
jest.mock('../../../src/services/cache.service');

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CharacterService();
  });

  function mockCacheMiss() {
    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);
    return cacheInstance;
  }

  function mockRepo() {
    return (CharacterRepository as jest.Mock).mock.instances[0];
  }

  describe('getCharacterInfo', () => {
    it('returns null when character not found', async () => {
      const repo = mockRepo();
      repo.findByName.mockResolvedValue(null);

      const result = await service.getCharacterInfo('Unknown');

      expect(result).toBeNull();
    });

    it('aggregates character stats and formats time', async () => {
      const repo = mockRepo();
      repo.findByName.mockResolvedValue({
        guid: 1,
        name: 'Hero',
        level: 80,
        race: 1,
        class: 1,
        gender: 0,
        health: 10000,
        totaltime: 3661,
        totalHonorPoints: 100,
        arenaPoints: 50,
        totalKills: 200,
      });
      repo.countQuests.mockResolvedValue(150);
      repo.countAchievements.mockResolvedValue(80);

      const cache = mockCacheMiss();

      const result = await service.getCharacterInfo('Hero');

      expect(result).toMatchObject({
        guid: 1,
        name: 'Hero',
        level: 80,
        race: 1,
        class: 1,
        gender: 0,
        health: 10000,
        side: 0,
        total_time: 3661,
        total_time_str: '0 天 1 小时 1 分钟',
        total_honor_points: 100,
        arena_points: 50,
        total_kills: 200,
        quest_count: 150,
        achievement_count: 80,
      });
      expect(cache.set).toHaveBeenCalledWith('character:info:Hero', expect.any(Object), CacheTTL.short);
    });
  });

  describe('getCharacterItems', () => {
    it('maps inventory slots correctly', async () => {
      const repo = mockRepo();
      repo.findInventory.mockResolvedValue([
        { item: 1001, slot: 0, itemEntry: 1234, displayid: 456, item_name: 'Sword', Quality: 4 },
      ]);

      const cache = mockCacheMiss();

      const result = await service.getCharacterItems('Hero');

      expect((result as any)[0]).toMatchObject({
        item_guid: 1001,
        slot: 0,
        item_entry: 1234,
        display_id: 456,
        name: 'Sword',
        quality: 4,
      });
      expect(cache.set).toHaveBeenCalledWith('character:items:Hero', expect.any(Array), CacheTTL.short);
    });
  });
});
