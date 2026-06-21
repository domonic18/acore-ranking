import { charactersDataSource, authDataSource } from '../config/database';
import { BaseRepository } from './base.repository';

export interface OnlinePlayerPosition {
  guid: number;
  name: string;
  class: number;
  race: number;
  level: number;
  gender: number;
  position_x: number;
  position_y: number;
  map: number;
  zone: number;
  extra_flags: number;
  is_hardcore: number;
  groupGuid: number | null;
}

export interface ServerStatus {
  online: number;
  uptime: number;
  maxplayers: number;
}

export class PlayerMapRepository extends BaseRepository {
  constructor() {
    super(charactersDataSource);
  }

  async findOnlinePlayersWithPosition(): Promise<OnlinePlayerPosition[]> {
    // 使用子查询检测 hardcore 表是否存在，避免表不存在时查询失败
    const hasHardcoreTables = await this.checkHardcoreTables();

    if (hasHardcoreTables) {
      return this.rawQuery(`
        SELECT
          c.guid, c.name, c.class, c.race, c.level, c.gender,
          c.position_x, c.position_y, c.map, c.zone,
          c.extra_flags,
          CASE WHEN p.character_guid IS NOT NULL THEN 1 ELSE 0 END as is_hardcore,
          g.guid as groupGuid
        FROM characters c
        LEFT JOIN hardcore_challenge_progress p ON p.character_guid = c.guid
        LEFT JOIN group_member g ON g.memberGuid = c.guid
        WHERE c.online = 1
        ORDER BY c.name
      `);
    }

    // 无 hardcore 表时简化查询
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.class, c.race, c.level, c.gender,
        c.position_x, c.position_y, c.map, c.zone,
        c.extra_flags,
        0 as is_hardcore,
        g.guid as groupGuid
      FROM characters c
      LEFT JOIN group_member g ON g.memberGuid = c.guid
      WHERE c.online = 1
      ORDER BY c.name
    `);
  }

  async findServerStatus(): Promise<ServerStatus[]> {
    // uptime 表在 auth (realmd) 数据库中
    return authDataSource.query(`
      SELECT
        1 as online,
        UNIX_TIMESTAMP() - starttime as uptime,
        maxplayers
      FROM uptime
      WHERE starttime = (SELECT MAX(starttime) FROM uptime)
      LIMIT 1
    `);
  }

  private async checkHardcoreTables(): Promise<boolean> {
    try {
      const result = await this.rawQuery(`
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'hardcore_challenge_progress'
        LIMIT 1
      `);
      return result.length > 0;
    } catch {
      return false;
    }
  }
}
