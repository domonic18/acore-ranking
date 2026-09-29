import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { BanlistRepository } from '../repositories/banlist.repository';

function formatBeijingTime(unixTimestamp: number): string {
  // UTC+8，格式化为 YYYY-MM-DD HH:mm:ss
  const date = new Date((unixTimestamp + 8 * 3600) * 1000);
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

interface RawBanRow {
  character_names: string | null;
  username: string | null;
  last_ip: string | null;
  bandate: number;
  unbandate: number;
  banreason: string | null;
}

interface BanListItem extends RawBanRow {
  banType: 'account' | 'character';
}

export class BanlistService {
  private cache = new CacheService();
  private repo = new BanlistRepository();

  async getRecent(): Promise<unknown[]> {
    const cacheKey = CacheKeys.banlist;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    // 账号封禁（auth.account_banned）与角色封禁（characters.character_banned，ACM .ban character 落此）合并展示
    const [accountRows, characterRows] = await Promise.all([
      this.repo.findRecent() as Promise<RawBanRow[]>,
      this.repo.findRecentCharacterBans() as Promise<(RawBanRow & { character_name: string | null; bannedby: string | null })[]>,
    ]);

    const items: BanListItem[] = [
      ...accountRows.map((r) => ({ ...r, banType: 'account' as const })),
      ...characterRows.map((r) => ({
        character_names: r.character_name,
        username: r.username,
        last_ip: r.last_ip,
        bandate: r.bandate,
        unbandate: r.unbandate,
        banreason: r.banreason,
        banType: 'character' as const,
      })),
    ].sort((a, b) => b.bandate - a.bandate);

    const result = items.map((r) => ({
      character_names: r.character_names,
      username: r.username,
      last_ip: r.last_ip,
      bandate: formatBeijingTime(r.bandate),
      unbandate: formatBeijingTime(r.unbandate),
      banreason: r.banreason,
      banType: r.banType,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }
}
