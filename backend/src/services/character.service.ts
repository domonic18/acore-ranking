import { CacheService, CacheTTL } from './cache.service';
import { CharacterRepository } from '../repositories/character.repository';
import { getFactionByRace } from '../shared/utils/faction.util';
import { formatTotalTime } from '../shared/utils/time.util';

export class CharacterService {
  private cache = new CacheService();
  private repo = new CharacterRepository();

  async getCharacterInfo(name: string): Promise<unknown | null> {
    const cacheKey = `character:info:${name}`;
    const cached = await this.cache.get<unknown>(cacheKey);
    if (cached) return cached;

    const char = await this.repo.findByName(name) as any;
    if (!char) return null;

    const questCount = await this.repo.countQuests(char.guid);
    const achieveCount = await this.repo.countAchievements(char.guid);

    const result = {
      guid: char.guid,
      name: char.name,
      level: char.level,
      race: char.race,
      class: char.class,
      gender: char.gender,
      health: char.health,
      side: getFactionByRace(char.race),
      total_time: char.totaltime,
      total_time_str: formatTotalTime(char.totaltime),
      total_honor_points: char.totalHonorPoints,
      arena_points: char.arenaPoints,
      total_kills: char.totalKills,
      quest_count: questCount,
      achievement_count: achieveCount,
    };

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getCharacterItems(name: string): Promise<unknown[]> {
    const cacheKey = `character:items:${name}`;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const items = await this.repo.findInventory(name) as any[];
    const result = items.map((item) => ({
      item_guid: item.item,
      slot: item.slot,
      item_entry: item.itemEntry,
      display_id: item.displayid,
      name: item.item_name,
      quality: item.Quality,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }
}
