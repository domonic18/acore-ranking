import { charactersDataSource } from '../config/database';

export class AchievementRepository {
  async findRecent(limit = 50): Promise<unknown[]> {
    const repo = charactersDataSource.getRepository('characters');
    return repo.query(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        c.level,
        ad.Title_Lang_zhCN AS achievement_description,
        FROM_UNIXTIME(ca.date) AS achievement_date
      FROM character_achievement AS ca
      INNER JOIN characters AS c ON ca.guid = c.guid
      INNER JOIN acore_world.achievement_dbc AS ad ON ca.achievement = ad.ID
      ORDER BY ca.date DESC
      LIMIT ${limit}
    `);
  }
}
