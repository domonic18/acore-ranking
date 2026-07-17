import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class RankingRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findTopGoldPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT guid, name, race, class, level, gender, money
      FROM characters
      ORDER BY money DESC
      LIMIT ${limit}
    `);
  }

  async findTopPlaytimePlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT guid, name, race, class, level, gender, totaltime
      FROM characters
      ORDER BY totaltime DESC
      LIMIT ${limit}
    `);
  }

  async findTopHonorPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT guid, name, race, class, level, gender, totaltime, totalHonorPoints
      FROM characters
      ORDER BY totalHonorPoints DESC
      LIMIT ${limit}
    `);
  }

  async findTopKillsPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT guid, name, race, class, level, gender, totaltime, totalKills
      FROM characters
      ORDER BY totalKills DESC
      LIMIT ${limit}
    `);
  }

  async findTopByAchievementCriteria(
    criteriaId: number,
    alias: string,
    limit = 200,
  ): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.race, c.class, c.level, c.gender,
        COALESCE(p.counter, 0) as ${alias}
      FROM characters c
      LEFT JOIN character_achievement_progress p ON c.guid = p.guid AND p.criteria = ${criteriaId}
      ORDER BY ${alias} DESC
      LIMIT ${limit}
    `);
  }

  async findTopReputationPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.race, c.class, c.level, c.gender,
        SUM(cr.standing) as total_reputation,
        COUNT(CASE WHEN cr.standing >= 42000 THEN 1 END) as exalted_count
      FROM characters c
      INNER JOIN character_reputation cr ON c.guid = cr.guid
      GROUP BY c.guid, c.name, c.race, c.class, c.level, c.gender
      ORDER BY total_reputation DESC
      LIMIT ${limit}
    `);
  }

  async findTopQuestPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.race, c.class, c.level, c.gender,
        COUNT(cq.quest) as quest_count
      FROM characters c
      INNER JOIN character_queststatus_rewarded cq ON c.guid = cq.guid
      GROUP BY c.guid, c.name, c.race, c.class, c.level, c.gender
      ORDER BY quest_count DESC
      LIMIT ${limit}
    `);
  }

  async findTopLegendaryPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.race, c.class, c.level, c.gender,
        COUNT(ii.itemEntry) as legendary_count,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', COALESCE(loc.Name, it.name),
            'display_id', it.displayid,
            'item_entry', ii.itemEntry
          )
        ) as legendary_items
      FROM characters c
      INNER JOIN character_inventory ci ON c.guid = ci.guid
      INNER JOIN item_instance ii ON ci.item = ii.guid
      INNER JOIN acore_world.item_template it ON ii.itemEntry = it.entry
      LEFT JOIN acore_world.item_template_locale loc ON it.entry = loc.ID AND loc.locale = 'zhCN'
      WHERE it.Quality = 5
      GROUP BY c.guid, c.name, c.race, c.class, c.level, c.gender
      ORDER BY legendary_count DESC
      LIMIT ${limit}
    `);
  }

  async findTopTodayKillsPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT guid, name, race, class, level, gender, todayKills
      FROM characters
      WHERE todayKills > 0
      ORDER BY todayKills DESC
      LIMIT ${limit}
    `);
  }

  async findTopAchievementPlayers(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        c.level,
        SUM(a.Points) as total_achieve_points
      FROM characters AS c
      INNER JOIN character_achievement AS ca ON c.guid = ca.guid
      INNER JOIN acore_world.achievement_dbc AS a ON ca.achievement = a.ID
      GROUP BY c.guid
      ORDER BY total_achieve_points DESC
      LIMIT ${limit}
    `);
  }

  async findTopMountPlayers(mountIds: number[], limit = 100): Promise<unknown[]> {
    if (mountIds.length === 0) {
      return [];
    }
    const ids = mountIds.join(',');
    return this.rawQuery(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.level,
        c.gender,
        COUNT(cs.spell) AS mount_count,
        GROUP_CONCAT(cs.spell) AS mount_ids
      FROM characters c
      LEFT JOIN character_spell cs ON c.guid = cs.guid
      WHERE cs.spell IN (${ids})
      GROUP BY c.guid, c.name, c.race, c.class, c.level, c.gender
      ORDER BY mount_count DESC
      LIMIT ${limit}
    `);
  }

  async findTopRareItemPlayers(itemEntries: number[], limit = 200): Promise<unknown[]> {
    if (itemEntries.length === 0) {
      return [];
    }
    const ids = itemEntries.join(',');
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.race, c.class, c.level, c.gender,
        COUNT(ii.itemEntry) as rare_item_count,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', COALESCE(loc.Name, it.name),
            'display_id', it.displayid,
            'item_entry', ii.itemEntry
          )
        ) as rare_items
      FROM characters c
      INNER JOIN character_inventory ci ON c.guid = ci.guid
      INNER JOIN item_instance ii ON ci.item = ii.guid
      INNER JOIN acore_world.item_template it ON ii.itemEntry = it.entry
      LEFT JOIN acore_world.item_template_locale loc ON it.entry = loc.ID AND loc.locale = 'zhCN'
      WHERE ii.itemEntry IN (${ids})
      GROUP BY c.guid, c.name, c.race, c.class, c.level, c.gender
      ORDER BY rare_item_count DESC
      LIMIT ${limit}
    `);
  }
}
