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
        f.character_level,
        f.total_spent_time
      FROM characters AS c
      INNER JOIN hardcore_challenge_completed AS f ON c.guid = f.character_guid
      WHERE f.character_level = ${level}
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
      INNER JOIN hardcore_challenge_failed AS f ON c.guid = f.character_guid
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
        f.character_level,
        f.total_spent_time
      FROM characters AS c
      INNER JOIN hardcore_challenge_completed AS f ON c.guid = f.character_guid
      LEFT JOIN hardcore_challenge_failed AS ff ON c.guid = ff.character_guid
      WHERE
        (f.character_level < 60 OR (f.character_level > 60 AND f.character_level < 70))
        AND c.name != ''
        AND f.character_level = (
          SELECT MAX(character_level)
          FROM hardcore_challenge_completed
          WHERE character_guid = c.guid
        )
        AND ff.character_guid IS NULL
      ORDER BY f.character_level DESC
      LIMIT 200
    `);
  }
}
