import { EncounterRepository } from '../repositories/encounter.repository';
import { CacheService, CacheKeys, CacheTTL } from './cache.service';

const BOSS_NAMES: Record<number, string> = {
  15956: '阿努布雷坎',
  15953: '黑女巫法琳娜',
  15952: '迈克斯纳',
  16061: '教官拉苏维奥斯',
  16060: '收割者戈提克',
  15954: '瘟疫使者诺斯',
  16028: '帕奇维克',
  15931: '格罗布鲁斯',
  15989: '萨菲隆',
  15990: '克尔苏加德',
  15932: '格拉斯',
  15928: '塔迪乌斯',
  15936: '肮脏的希尔盖',
  16011: '洛欧塞布',
};

function getBossName(entry: number): string {
  return BOSS_NAMES[entry] || `Boss #${entry}`;
}

function formatBeijingTime(dateStr: string): string {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 8);
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

function parsePlayerNames(playersInfo: string): string[] {
  if (!playersInfo) return [];
  return playersInfo
    .split('\n')
    .map((line) => line.split(' (')[0]?.trim())
    .filter(Boolean);
}

export interface EncounterKill {
  time: string;
  boss_name: string;
  boss_entry: number;
  map: number;
  difficulty: number;
  players: string[];
}

export interface FirstKillRecord {
  boss_name: string;
  boss_entry: number;
  first_kill: string;
  first_kill_players: string[];
  kill_count: number;
}

export class EncounterService {
  private cache = new CacheService();
  private repo = new EncounterRepository();

  async getFirstKills(): Promise<FirstKillRecord[]> {
    const cacheKey = CacheKeys.encounterBosses;
    const cached = await this.cache.get<FirstKillRecord[]>(cacheKey);
    if (cached) return cached;

    const rows = await this.repo.findFirstKills() as any[];
    const result = rows.map((row) => ({
      boss_name: getBossName(row.creditEntry),
      boss_entry: row.creditEntry,
      first_kill: formatBeijingTime(row.first_kill),
      first_kill_players: parsePlayerNames(row.first_kill_players),
      kill_count: Number(row.kill_count),
    }));

    await this.cache.set(cacheKey, result, CacheTTL.medium);
    return result;
  }
}
