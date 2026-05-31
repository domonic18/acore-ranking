import { AchievementService } from '../../../src/services/achievement.service';
import { AchievementRepository } from '../../../src/repositories/achievement.repository';
import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';

jest.mock('../../../src/repositories/achievement.repository');
jest.mock('../../../src/services/cache.service');

describe('AchievementService', () => {
  let service: AchievementService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AchievementService();
  });

  it('returns cached recent achievements on cache hit', async () => {
    const cached = [{ guid: 1, name: 'Cached' }];
    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(cached);

    const result = await service.getRecent();

    expect(result).toEqual(cached);
  });

  it('queries repo and formats achievements on cache miss', async () => {
    const achievements = [
      {
        guid: 1,
        name: 'Achiever',
        race: 1,
        class: 1,
        gender: 0,
        level: 80,
        achievement_description: 'Completed Something',
        achievement_date: 1704067200,
      },
    ];
    const repoInstance = (AchievementRepository as jest.Mock).mock.instances[0];
    repoInstance.findRecent.mockResolvedValue(achievements);

    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);

    const result = await service.getRecent();

    expect((result as any)[0]).toMatchObject({
      guid: 1,
      name: 'Achiever',
      achievement_description: 'Completed Something',
      achievement_date: '2024-01-01',
    });
    expect(cacheInstance.set).toHaveBeenCalledWith(CacheKeys.recentAchieve, expect.any(Array), CacheTTL.short);
  });
});
