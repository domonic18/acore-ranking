import { OnlineService } from '../../../src/services/online.service';
import { OnlineRepository } from '../../../src/repositories/online.repository';
import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';

jest.mock('../../../src/repositories/online.repository');
jest.mock('../../../src/services/cache.service');

describe('OnlineService', () => {
  let service: OnlineService;
  let mockRepo: jest.MockedObjectDeep<typeof OnlineRepository>;
  let mockCache: jest.MockedObjectDeep<typeof CacheService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OnlineService();
    mockRepo = jest.mocked(OnlineRepository);
    mockCache = jest.mocked(CacheService);
  });

  describe('getOnlineCount', () => {
    it('returns cached data when cache hit', async () => {
      const cached = { total_count: 10, alliance_count: 6, horde_count: 4 };
      const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
      cacheInstance.get.mockResolvedValue(cached);
      const repoInstance = (OnlineRepository as jest.Mock).mock.instances[0];

      const result = await service.getOnlineCount();

      expect(result).toEqual(cached);
      expect(cacheInstance.get).toHaveBeenCalledWith(CacheKeys.onlineCount);
      expect(repoInstance.countOnlinePlayers).not.toHaveBeenCalled();
      expect(repoInstance.findOnlinePlayers).not.toHaveBeenCalled();
    });

    it('queries repo and caches result on cache miss', async () => {
      const dbResult = { total_count: '5', alliance_count: '3', horde_count: '2' };
      const repoInstance = (OnlineRepository as jest.Mock).mock.instances[0];
      repoInstance.countOnlinePlayers.mockResolvedValue(dbResult);

      const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
      cacheInstance.get.mockResolvedValue(null);
      cacheInstance.set.mockResolvedValue(undefined);

      const result = await service.getOnlineCount();

      expect(result).toEqual({ total_count: 5, alliance_count: 3, horde_count: 2 });
      expect(repoInstance.countOnlinePlayers).toHaveBeenCalled();
      expect(cacheInstance.set).toHaveBeenCalledWith(
        CacheKeys.onlineCount,
        { total_count: 5, alliance_count: 3, horde_count: 2 },
        CacheTTL.realtime,
      );
    });

    it('defaults to 0 for missing fields', async () => {
      const repoInstance = (OnlineRepository as jest.Mock).mock.instances[0];
      repoInstance.countOnlinePlayers.mockResolvedValue({});

      const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
      cacheInstance.get.mockResolvedValue(null);
      cacheInstance.set.mockResolvedValue(undefined);

      const result = await service.getOnlineCount();

      expect(result).toEqual({ total_count: 0, alliance_count: 0, horde_count: 0 });
    });
  });

  describe('getOnlinePlayers', () => {
    it('returns cached data when cache hit', async () => {
      const cached = [{ guid: 1, name: 'Test' }];
      const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
      cacheInstance.get.mockResolvedValue(cached);

      const result = await service.getOnlinePlayers();

      expect(result).toEqual(cached);
    });

    it('queries repo and maps faction on cache miss', async () => {
      const players = [
        { guid: 1, name: 'AlliancePlayer', race: 1, class: 1, gender: 0, level: 80 },
        { guid: 2, name: 'HordePlayer', race: 2, class: 2, gender: 1, level: 80 },
      ];
      const repoInstance = (OnlineRepository as jest.Mock).mock.instances[0];
      repoInstance.findOnlinePlayers.mockResolvedValue(players);

      const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
      cacheInstance.get.mockResolvedValue(null);
      cacheInstance.set.mockResolvedValue(undefined);

      const result = await service.getOnlinePlayers();

      expect(result).toHaveLength(2);
      expect((result as any)[0]).toMatchObject({
        guid: 1, name: 'AlliancePlayer', race: 1, side: 0,
      });
      expect((result as any)[1]).toMatchObject({
        guid: 2, name: 'HordePlayer', race: 2, side: 1,
      });
    });

    it('falls back to 已删号 for empty names', async () => {
      const players = [{ guid: 1, name: '', race: 1, class: 1, gender: 0, level: 1 }];
      const repoInstance = (OnlineRepository as jest.Mock).mock.instances[0];
      repoInstance.findOnlinePlayers.mockResolvedValue(players);

      const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
      cacheInstance.get.mockResolvedValue(null);
      cacheInstance.set.mockResolvedValue(undefined);

      const result = await service.getOnlinePlayers();

      expect((result as any)[0].name).toBe('已删号');
    });
  });
});
