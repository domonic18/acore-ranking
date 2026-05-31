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
      WITH max_levels AS (
        SELECT character_guid, MAX(character_level) AS max_level
        FROM hardcore_challenge_completed
        GROUP BY character_guid
      )
      SELECT
        c.guid,
        c.name,
        c.race,
        c.class,
        c.gender,
        ml.max_level AS character_level,
        f.total_spent_time
      FROM max_levels ml
      INNER JOIN characters c ON c.guid = ml.character_guid
      INNER JOIN hardcore_challenge_completed f
        ON f.character_guid = ml.character_guid AND f.character_level = ml.max_level
      LEFT JOIN hardcore_challenge_failed ff ON ff.character_guid = ml.character_guid
      WHERE
        ml.max_level < 60
        AND c.name != ''
        AND ff.character_guid IS NULL
      ORDER BY ml.max_level DESC
      LIMIT 200
    `);
  }
}
