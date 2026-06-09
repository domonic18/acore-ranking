import { charactersDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export class AuctionRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findAuctions(limit = 500): Promise<unknown[]> {
    return this.rawQuery(`
      SELECT
        ah.id,
        ah.houseid,
        ah.itemguid,
        ah.itemowner,
        ah.buyoutprice,
        ah.time,
        ah.buyguid,
        ah.lastbid,
        ah.startbid,
        ah.deposit,
        ii.itemEntry,
        it.displayid,
        COALESCE(loc.Name, it.name) as item_name,
        it.Quality,
        c.name as owner_name
      FROM auctionhouse ah
      INNER JOIN item_instance ii ON ah.itemguid = ii.guid
      INNER JOIN acore_world.item_template it ON ii.itemEntry = it.entry
      LEFT JOIN acore_world.item_template_locale loc ON it.entry = loc.ID AND loc.locale = 'zhCN'
      LEFT JOIN characters c ON ah.itemowner = c.guid
      WHERE ah.time > UNIX_TIMESTAMP()
      ORDER BY ah.time ASC
      LIMIT ${limit}
    `);
  }
}
