import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { BanlistRepository } from '../repositories/banlist.repository';

function formatBeijingTime(unixTimestamp: number): string {
  // UTC+8，格式化为 YYYY-MM-DD HH:mm:ss
  const date = new Date((unixTimestamp + 8 * 3600) * 1000);
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export class BanlistService {
  private cache = new CacheService();
  private repo = new BanlistRepository();

  async getRecent(): Promise<unknown[]> {
    const cacheKey = CacheKeys.banlist;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const rows = await this.repo.findRecent() as any[];
    const result = rows.map((r) => ({
      character_names: r.character_names,
      username: r.username,
      last_ip: r.last_ip,
      bandate: formatBeijingTime(r.bandate),
      banreason: r.banreason,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }
}
