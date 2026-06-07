import { authDataSource } from '../config/database';
import { env } from '../config/env';
import { BaseRepository } from './base.repository';

export class BanlistRepository extends BaseRepository {
  constructor() {
    super(authDataSource);
  }

  async findRecent(limit = 200): Promise<unknown[]> {
    const hasHardcoreFailed = await this.checkHardcoreFailedTable();
    const excludeHardcore = hasHardcoreFailed
      ? `AND NOT EXISTS (SELECT 1 FROM ${env.DB_CHARACTERS}.hardcore_challenge_failed hcf WHERE hcf.character_guid = c.guid)`
      : '';

    return this.rawQuery(`
      SELECT
        a.username,
        a.last_ip,
        ab.bandate,
        ab.unbandate,
        ab.banreason,
        GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ',') AS character_names
      FROM account_banned ab
      LEFT JOIN account a ON ab.id = a.id
      LEFT JOIN ${env.DB_CHARACTERS}.characters c ON c.account = a.id
        AND c.name IS NOT NULL
        AND c.name != ''
        ${excludeHardcore}
      WHERE ab.active = 1
      GROUP BY a.id, a.username, a.last_ip, ab.bandate, ab.unbandate, ab.banreason
      ORDER BY ab.bandate DESC
      LIMIT ${limit}
    `);
  }

  private async checkHardcoreFailedTable(): Promise<boolean> {
    try {
      const result = await this.rawQuery(`
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = '${env.DB_CHARACTERS}'
          AND table_name = 'hardcore_challenge_failed'
        LIMIT 1
      `);
      return result.length > 0;
    } catch {
      return false;
    }
  }
}
