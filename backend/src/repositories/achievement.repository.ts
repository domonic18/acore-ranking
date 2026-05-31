import { charactersDataSource } from '../config/database';
import { env } from '../config/env';
import { BaseRepository } from './base.repository';

export class AchievementRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findRecent(limit = env.RECENT_ACHIEVEMENT_LIMIT): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        c.level,
        ad.Title_Lang_deDE AS achievement_description,
        ca.date AS achievement_date
      FROM character_achievement AS ca
      INNER JOIN characters AS c ON ca.guid = c.guid
      INNER JOIN acore_world.achievement_dbc AS ad ON ca.achievement = ad.ID
      ORDER BY ca.date DESC
      LIMIT ${limit}
    `);
  }
}
