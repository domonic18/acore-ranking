import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class CharacterRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findByName(name: string): Promise<unknown | null> {
    const result = await this.rawQuery(`
      SELECT
        guid, power1, power2, power4, power7,
        class, name, level, race, gender,
        health, totaltime, totalHonorPoints,
        arenaPoints, totalKills
      FROM characters
      WHERE name = ?
      LIMIT 1
    `, [name]);
    return result[0] || null;
  }

  async countQuests(guid: number): Promise<number> {
    const result = await this.rawQuery<{ count: number }>(`
      SELECT COUNT(*) as count
      FROM character_queststatus_rewarded
      WHERE guid = ?
    `, [guid]);
    return result[0]?.count || 0;
  }

  async countAchievements(guid: number): Promise<number> {
    const result = await this.rawQuery<{ count: number }>(`
      SELECT COUNT(*) as count
      FROM character_achievement
      WHERE guid = ?
    `, [guid]);
    return result[0]?.count || 0;
  }

  async findInventory(name: string): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        ci.item,
        ci.slot,
        ii.itemEntry,
        it.displayid,
        it.name as item_name,
        it.Quality
      FROM characters c
      INNER JOIN character_inventory ci ON c.guid = ci.guid
      INNER JOIN item_instance ii ON ci.item = ii.guid
      INNER JOIN acore_world.item_template it ON ii.itemEntry = it.entry
      WHERE c.name = ? AND ci.slot BETWEEN 0 AND 19 AND ci.bag = 0
    `, [name]);
  }
}
