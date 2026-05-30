import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { BanlistRepository } from '../repositories/banlist.repository';

export class BanlistService {
  private cache = new CacheService();
  private repo = new BanlistRepository();

  async getRecent(): Promise<unknown[]> {
    const cacheKey = CacheKeys.banlist;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const rows = await this.repo.findRecent() as any[];
    const result = rows.map((r) => ({
      username: r.username,
      last_ip: r.last_ip,
      bandate: new Date(r.bandate * 1000).toISOString(),
      unbandate: new Date(r.unbandate * 1000).toISOString(),
      banreason: r.banreason,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }
}
