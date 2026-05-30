import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class OnlineRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findOnlinePlayers(): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT guid, name, race, class, level, gender, totaltime
      FROM characters
      WHERE online = 1 AND NOT extra_flags & 16
      ORDER BY level DESC
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
