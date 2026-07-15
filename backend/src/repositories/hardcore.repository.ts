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
        f.character_guid AS guid,
        CASE WHEN c.guid IS NULL THEN '已删号' ELSE COALESCE(c.name, '已删号') END AS name,
        CAST(COALESCE(c.race, 0) AS UNSIGNED) AS race,
        CAST(COALESCE(c.class, 0) AS UNSIGNED) AS class,
        CAST(COALESCE(c.gender, 0) AS UNSIGNED) AS gender,
        f.character_level,
        f.total_spent_time,
        f.death_reason,
        f.death_location_zone_id,
        f.death_location_area_id,
        f.killer_info
      FROM hardcore_challenge_failure AS f
      LEFT JOIN characters AS c ON c.guid = f.character_guid
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
