import { authDataSource } from '../config/database';

export class BanlistRepository {
  async findRecent(limit = 200): Promise<unknown[]> {
    const repo = authDataSource.getRepository('account_banned');
    return repo.query(`
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
