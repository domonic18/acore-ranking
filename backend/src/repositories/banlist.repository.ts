import { authDataSource } from '../config/database';
import { env } from '../config/env';
import { BaseRepository } from './base.repository';

export class BanlistRepository extends BaseRepository {
  constructor() {
    super(authDataSource);
  }

  async findRecent(limit = 200): Promise<unknown[]> {
    const excludeHardcore = await this.hardcoreFailureNotExists('c');

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

  /** 角色级封禁（characters.character_banned，ACM .ban character 落此表），跨库关联账号信息 */
  async findRecentCharacterBans(limit = 200): Promise<unknown[]> {
    const excludeHardcore = await this.hardcoreFailureNotExists('cb');

    return this.rawQuery(`
      SELECT
        c.name AS character_name,
        a.username,
        a.last_ip,
        cb.bandate,
        cb.unbandate,
        cb.banreason,
        cb.bannedby
      FROM ${env.DB_CHARACTERS}.character_banned cb
      LEFT JOIN ${env.DB_CHARACTERS}.characters c ON c.guid = cb.guid
      LEFT JOIN account a ON a.id = c.account
      WHERE cb.active = 1
        ${excludeHardcore}
      ORDER BY cb.bandate DESC
      LIMIT ${limit}
    `);
  }

  /** 硬核阵亡角色不进封禁列表；表不存在（旧库）时跳过过滤 */
  private async hardcoreFailureNotExists(alias: string): Promise<string> {
    if (!(await this.checkHardcoreFailedTable())) return '';
    return `AND NOT EXISTS (SELECT 1 FROM ${env.DB_CHARACTERS}.hardcore_challenge_failure hcf WHERE hcf.character_guid = ${alias}.guid)`;
  }

  private async checkHardcoreFailedTable(): Promise<boolean> {
    try {
      const result = await this.rawQuery(`
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = '${env.DB_CHARACTERS}'
          AND table_name = 'hardcore_challenge_failure'
        LIMIT 1
      `);
      return result.length > 0;
    } catch {
      return false;
    }
  }
}
