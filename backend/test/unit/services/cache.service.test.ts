import { CacheService, CacheKeys, CacheTTL } from '../../../src/services/cache.service';
import { redis } from '../../../src/config/redis';

jest.mock('../../../src/config/redis', () => ({
  redis: {
    get: jest.fn(),
    setex: jest.fn(),
  },
}));

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new CacheService();
  });

  describe('get', () => {
    it('returns parsed JSON on cache hit', async () => {
      (redis.get as jest.Mock).mockResolvedValue('{"key":"value"}');

      const result = await cache.get('test-key');

      expect(result).toEqual({ key: 'value' });
      expect(redis.get).toHaveBeenCalledWith('test-key');
    });

    it('returns null on cache miss', async () => {
      (redis.get as jest.Mock).mockResolvedValue(null);

      const result = await cache.get('missing-key');

      expect(result).toBeNull();
    });

    it('returns null on JSON parse error', async () => {
      (redis.get as jest.Mock).mockResolvedValue('invalid-json');

      const result = await cache.get('bad-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('stores JSON string with TTL', async () => {
      (redis.setex as jest.Mock).mockResolvedValue('OK');

      await cache.set('test-key', { foo: 'bar' }, 300);

      expect(redis.setex).toHaveBeenCalledWith('test-key', 300, '{"foo":"bar"}');
    });
  });

  describe('CacheKeys', () => {
    it('contains expected keys', () => {
      expect(CacheKeys.onlineCount).toBe('online:count');
      expect(CacheKeys.topGold).toBe('ranking:gold');
      expect(CacheKeys.hardcoreCompleted(60)).toBe('hardcore:completed:60');
    });
  });

  describe('CacheTTL', () => {
    it('has correct durations', () => {
      expect(CacheTTL.realtime).toBe(60);
      expect(CacheTTL.short).toBe(300);
      expect(CacheTTL.medium).toBe(1800);
    });
  });
});
