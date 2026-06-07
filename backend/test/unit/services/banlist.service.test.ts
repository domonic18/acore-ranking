import { BanlistService } from '../../../src/services/banlist.service';
import { BanlistRepository } from '../../../src/repositories/banlist.repository';
import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';

jest.mock('../../../src/repositories/banlist.repository');
jest.mock('../../../src/services/cache.service');

describe('BanlistService', () => {
  let service: BanlistService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BanlistService();
  });

  it('converts unix timestamps to Beijing time strings', async () => {
    const repoInstance = (BanlistRepository as jest.Mock).mock.instances[0];
    repoInstance.findRecent.mockResolvedValue([
      {
        character_names: 'PlayerOne,PlayerTwo',
        username: 'cheater',
        last_ip: '192.168.1.1',
        bandate: 1700000000,
        banreason: 'Speed hack',
      },
    ]);

    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);

    const result = await service.getRecent();

    expect((result as any)[0]).toMatchObject({
      character_names: 'PlayerOne,PlayerTwo',
      username: 'cheater',
      last_ip: '192.168.1.1',
      banreason: 'Speed hack',
    });
    expect((result as any)[0].bandate).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(cacheInstance.set).toHaveBeenCalledWith(CacheKeys.banlist, expect.any(Array), CacheTTL.medium);
  });
});
