import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class HardcoreRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findCompletedByLevel(level: number): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        s.completed_level AS character_level,
        s.total_spent_time
      FROM characters AS c
      INNER JOIN hardcore_challenge_success AS s ON c.guid = s.character_guid
      WHERE s.completed_level = ${level}
    `);
  }

  async findFailed(): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        f.character_level,
        f.total_spent_time
      FROM characters AS c
      INNER JOIN hardcore_challenge_failure AS f ON c.guid = f.character_guid
      ORDER BY f.id DESC
      LIMIT 500
    `);
  }

  async findIncomplete(): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        p.current_level AS character_level,
        p.total_spent_time
      FROM characters c
      INNER JOIN hardcore_challenge_progress p ON c.guid = p.character_guid
      LEFT JOIN hardcore_challenge_failure f ON f.character_guid = c.guid
      WHERE c.name != ''
        AND p.current_level NOT IN (60, 70, 80)
        AND f.character_guid IS NULL
      ORDER BY p.current_level DESC
      LIMIT 200
    `);
  }
}
