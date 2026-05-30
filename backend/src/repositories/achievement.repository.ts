import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class AchievementRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findRecent(limit = 50): Promise<unknown[]> {
    return this.rawQuery(`
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
