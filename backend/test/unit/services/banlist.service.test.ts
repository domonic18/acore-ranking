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

  it('converts unix timestamps to ISO strings', async () => {
    const repoInstance = (BanlistRepository as jest.Mock).mock.instances[0];
    repoInstance.findRecent.mockResolvedValue([
      {
        username: 'cheater',
        last_ip: '192.168.1.1',
        bandate: 1700000000,
        unbandate: 1700086400,
        banreason: 'Speed hack',
      },
    ]);

    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);

    const result = await service.getRecent();

    expect((result as any)[0]).toMatchObject({
      username: 'cheater',
      last_ip: '192.168.1.1',
      banreason: 'Speed hack',
    });
    expect((result as any)[0].bandate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect((result as any)[0].unbandate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(cacheInstance.set).toHaveBeenCalledWith(CacheKeys.banlist, expect.any(Array), CacheTTL.medium);
  });
});
