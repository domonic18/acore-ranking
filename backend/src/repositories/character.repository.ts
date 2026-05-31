import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class CharacterRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findByName(name: string): Promise<unknown | null> {
    const result = await this.rawQuery(`
      SELECT
        c.guid, c.power1, c.power2, c.power4, c.power7,
        c.class, c.name, c.level, c.race, c.gender,
        c.health, c.totaltime, c.totalHonorPoints,
        c.arenaPoints, c.totalKills,
        c.creation_date,
        c.logout_time,
        g.name as guild_name
      FROM characters c
      LEFT JOIN guild_member gm ON c.guid = gm.guid
      LEFT JOIN guild g ON gm.guildid = g.guildid
      WHERE c.name = ?
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
    return Number(result[0]?.count || 0);
  }

  async countAchievements(guid: number): Promise<number> {
    const result = await this.rawQuery<{ count: number }>(`
      SELECT COUNT(*) as count
      FROM character_achievement
      WHERE guid = ?
    `, [guid]);
    return Number(result[0]?.count || 0);
  }

  async findInventory(name: string): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        ci.item,
        ci.slot,
        ii.itemEntry,
        it.displayid,
        COALESCE(loc.Name, it.name) as item_name,
        it.Quality
      FROM characters c
      INNER JOIN character_inventory ci ON c.guid = ci.guid
      INNER JOIN item_instance ii ON ci.item = ii.guid
      INNER JOIN acore_world.item_template it ON ii.itemEntry = it.entry
      LEFT JOIN acore_world.item_template_locale loc ON it.entry = loc.ID AND loc.locale = 'zhCN'
      WHERE c.name = ? AND ci.slot BETWEEN 0 AND 19 AND ci.bag = 0
    `, [name]);
  }

  async findTalents(guid: number): Promise<{ spell: number; specMask: number }[]> {
    return this.rawQuery(`
      SELECT spell, specMask
      FROM character_talent
      WHERE guid = ?
    `, [guid]) as Promise<{ spell: number; specMask: number }[]>;
  }

  async findGlyphs(guid: number): Promise<{ talentGroup: number; glyph1: number; glyph2: number; glyph3: number; glyph4: number; glyph5: number; glyph6: number }[]> {
    return this.rawQuery(`
      SELECT talentGroup, glyph1, glyph2, glyph3, glyph4, glyph5, glyph6
      FROM character_glyphs
      WHERE guid = ?
    `, [guid]) as Promise<{ talentGroup: number; glyph1: number; glyph2: number; glyph3: number; glyph4: number; glyph5: number; glyph6: number }[]>;
  }

  async findAchievements(guid: number): Promise<{ achievement: number; date: number }[]> {
    return this.rawQuery(`
      SELECT achievement, date
      FROM character_achievement
      WHERE guid = ?
    `, [guid]) as Promise<{ achievement: number; date: number }[]>;
  }
}
