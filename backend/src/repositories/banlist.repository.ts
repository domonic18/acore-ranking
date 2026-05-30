import { authDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class BanlistRepository extends BaseRepository {
  constructor() {
    super(authDataSource);
  }

  async findRecent(limit = 200): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        account.username,
        account.last_ip,
        account_banned.bandate,
        account_banned.unbandate,
        account_banned.banreason
      FROM account_banned
      LEFT JOIN account ON account_banned.id = account.id
      WHERE account_banned.active = 1
      ORDER BY account_banned.bandate DESC
      LIMIT ${limit}
    `);
  }
}
