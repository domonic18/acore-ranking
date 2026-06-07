import { EncounterService } from '../../../src/services/encounter.service';
import { EncounterRepository } from '../../../src/repositories/encounter.repository';
import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';

jest.mock('../../../src/repositories/encounter.repository');
jest.mock('../../../src/services/cache.service');

describe('EncounterService', () => {
  let service: EncounterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EncounterService();
  });

  it('returns first kill records with parsed player names and Beijing time', async () => {
    const repoInstance = (EncounterRepository as jest.Mock).mock.instances[0];
    repoInstance.findFirstKills.mockResolvedValue([
      {
        creditEntry: 15956,
        first_kill: '2024-01-04T12:44:45.000Z',
        first_kill_players: 'PlayerOne (GUID Full: 0x... Type: Player Low: 1, acc: 1, ip: 1.1.1.1, guild: 1), xyz: (1,2,3), auras: 1(1)\nPlayerTwo (GUID Full: 0x... Type: Player Low: 2, acc: 2, ip: 2.2.2.2, guild: 2), xyz: (4,5,6), auras: 2(2)',
        kill_count: 18,
      },
    ]);

    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);

    const result = await service.getFirstKills();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      boss_name: '阿努布雷坎',
      boss_entry: 15956,
      kill_count: 18,
      first_kill_players: ['PlayerOne', 'PlayerTwo'],
    });
    expect(result[0].first_kill).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(cacheInstance.set).toHaveBeenCalledWith(CacheKeys.encounterBosses, expect.any(Array), CacheTTL.medium);
  });

  it('falls back to entry ID for unknown bosses', async () => {
    const repoInstance = (EncounterRepository as jest.Mock).mock.instances[0];
    repoInstance.findFirstKills.mockResolvedValue([
      {
        creditEntry: 99999,
        first_kill: '2024-01-04T12:44:45.000Z',
        first_kill_players: 'UnknownPlayer (GUID Full: ...)',
        kill_count: 1,
      },
    ]);

    const cacheInstance = (CacheService as jest.Mock).mock.instances[0];
    cacheInstance.get.mockResolvedValue(null);
    cacheInstance.set.mockResolvedValue(undefined);

    const result = await service.getFirstKills();

    expect(result[0].boss_name).toBe('Boss #99999');
  });
});
