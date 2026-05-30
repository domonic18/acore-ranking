import { charactersDataSource } from '../config/database';

export class RankingRepository {
  async findTopGoldPlayers(limit = 200): Promise<unknown[]> {
    const repo = charactersDataSource.getRepository('characters');
    return repo.query(`
      SELECT guid, name, race, class, level, gender, money
      FROM characters
      ORDER BY money DESC
      LIMIT ${limit}
    `);
  }

  async findTopPlaytimePlayers(limit = 200): Promise<unknown[]> {
    const repo = charactersDataSource.getRepository('characters');
    return repo.query(`
      SELECT guid, name, race, class, level, gender, totaltime
      FROM characters
      ORDER BY totaltime DESC
      LIMIT ${limit}
    `);
  }

  async findTopHonorPlayers(limit = 200): Promise<unknown[]> {
    const repo = charactersDataSource.getRepository('characters');
    return repo.query(`
      SELECT guid, name, race, class, level, gender, totaltime, totalHonorPoints
      FROM characters
      ORDER BY totalHonorPoints DESC
      LIMIT ${limit}
    `);
  }

  async findTopAchievementPlayers(limit = 200): Promise<unknown[]> {
    const repo = charactersDataSource.getRepository('characters');
    return repo.query(`
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
    const repo = charactersDataSource.getRepository('characters');
    const ids = mountIds.join(',');
    return repo.query(`
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
}
