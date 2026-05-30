import { charactersDataSource } from '../config/database';

export class CharacterRepository {
  async findByName(name: string): Promise<unknown | null> {
    const repo = charactersDataSource.getRepository('characters');
    const result = await repo.query(`
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
    const repo = charactersDataSource.getRepository('characters');
    const result = await repo.query(`
      SELECT COUNT(*) as count
      FROM character_queststatus_rewarded
      WHERE guid = ?
    `, [guid]);
    return result[0]?.count || 0;
  }

  async countAchievements(guid: number): Promise<number> {
    const repo = charactersDataSource.getRepository('characters');
    const result = await repo.query(`
      SELECT COUNT(*) as count
      FROM character_achievement
      WHERE guid = ?
    `, [guid]);
    return result[0]?.count || 0;
  }

  async findInventory(name: string): Promise<unknown[]> {
    const repo = charactersDataSource.getRepository('characters');
    return repo.query(`
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
