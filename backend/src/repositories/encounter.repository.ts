import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class EncounterRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findRecentKills(limit = 100): Promise<unknown[]> {
    return this.rawQuery(
      `SELECT time, map, difficulty, creditEntry, playersInfo
       FROM log_encounter
       ORDER BY time DESC
       LIMIT ?`,
      [limit],
    );
  }

  async findFirstKills(): Promise<unknown[]> {
    return this.rawQuery(
      `SELECT
         le.creditEntry,
         le.time AS first_kill,
         le.playersInfo AS first_kill_players,
         counts.kill_count
       FROM log_encounter le
       INNER JOIN (
         SELECT creditEntry, MIN(time) AS min_time, COUNT(*) AS kill_count
         FROM log_encounter
         GROUP BY creditEntry
       ) counts ON le.creditEntry = counts.creditEntry AND le.time = counts.min_time
       ORDER BY le.time ASC`,
    );
  }
}
