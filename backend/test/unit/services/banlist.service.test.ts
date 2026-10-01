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

  function prepareCache(miss = true): { cacheInstance: any } {
    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(miss ? null : [{ cached: true }]);
    cacheInstance.set.mockResolvedValue(undefined);
    return { cacheInstance };
  }

  it('converts unix timestamps to Beijing time strings', async () => {
    const repoInstance = (BanlistRepository as jest.Mock).mock.instances[0];
    repoInstance.findRecent.mockResolvedValue([
      {
        character_names: 'PlayerOne,PlayerTwo',
        username: 'cheater',
        last_ip: '192.168.1.1',
        bandate: 1700000000,
        unbandate: 1700000000,
        banreason: 'Speed hack',
      },
    ]);
    repoInstance.findRecentCharacterBans.mockResolvedValue([]);
    const { cacheInstance } = prepareCache();

    const result = await service.getRecent();

    expect((result as any)[0]).toMatchObject({
      character_names: 'PlayerOne,PlayerTwo',
      username: 'cheater',
      last_ip: '192.168.1.1',
      banreason: 'Speed hack',
      banType: 'account',
    });
    expect((result as any)[0].bandate).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect((result as any)[0].unbandate).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(cacheInstance.set).toHaveBeenCalledWith(CacheKeys.banlist, expect.any(Array), CacheTTL.medium);
  });

  it('merges character bans from character_banned with banType and sorts by bandate desc', async () => {
    const repoInstance = (BanlistRepository as jest.Mock).mock.instances[0];
    repoInstance.findRecent.mockResolvedValue([
      {
        character_names: 'A1,A2',
        username: 'older',
        last_ip: '10.0.0.1',
        bandate: 1700000000,
        unbandate: 1700000000,
        banreason: 'account ban',
      },
    ]);
    repoInstance.findRecentCharacterBans.mockResolvedValue([
      {
        character_name: 'Hacker丶X',
        username: 'newer',
        last_ip: '1.2.3.4',
        bandate: 1700086400,
        unbandate: 1700086400,
        banreason: 'teleport hack',
        bannedby: 'Adminchar',
      },
    ]);
    prepareCache();

    const result = (await service.getRecent()) as any[];

    expect(result).toHaveLength(2);
    // bandate 更新的角色封禁排前
    expect(result[0]).toMatchObject({
      banType: 'character',
      character_names: 'Hacker丶X',
      username: 'newer',
      banreason: 'teleport hack',
    });
    expect(result[1]).toMatchObject({ banType: 'account', character_names: 'A1,A2' });
    expect(result[0].bandate).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('returns cached payload without querying repositories', async () => {
    const cached = [{ character_names: 'X', banType: 'character' }];
    const repoInstance = (BanlistRepository as jest.Mock).mock.instances[0];
    prepareCache(false);
    (CacheService as jest.Mock).mock.instances[0].get.mockResolvedValue(cached);

    const result = await service.getRecent();

    expect(result).toEqual(cached);
    expect(repoInstance.findRecent).not.toHaveBeenCalled();
    expect(repoInstance.findRecentCharacterBans).not.toHaveBeenCalled();
  });
});
