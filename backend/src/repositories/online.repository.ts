import { charactersDataSource } from '../config/database';
import { env } from '../config/env';
import { BaseRepository } from './base.repository';

export class OnlineRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findOnlinePlayers(): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT c.guid, c.name, c.race, c.class, c.level, c.gender, c.totaltime, a.last_ip
      FROM characters c
      LEFT JOIN ${env.DB_AUTH}.account a ON a.id = c.account
      WHERE c.online = 1 AND NOT c.extra_flags & 16
      ORDER BY c.level DESC
    `);
  }

  async countOnlinePlayers(): Promise<unknown> {
    const result = await this.rawQuery(`
      SELECT
        COUNT(*) as total_count,
        SUM(CASE WHEN race IN (1, 3, 4, 7, 11) THEN 1 ELSE 0 END) AS alliance_count,
        SUM(CASE WHEN race IN (2, 5, 6, 8, 9, 10) THEN 1 ELSE 0 END) AS horde_count
      FROM characters
      WHERE online = 1 AND NOT extra_flags & 16
    `);
    return result[0];
  }
}
