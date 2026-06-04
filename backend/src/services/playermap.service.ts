import { PlayerMapRepository } from '../repositories/playermap.repository';
import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { getZoneName } from '../data/zoneNames';

export interface MapPlayer {
  name: string;
  level: number;
  race: number;
  class: number;
  gender: number;
  faction: 'alliance' | 'horde';
  x: number;
  y: number;
  map: number;
  zone: string;
  isHardcore: boolean;
  groupGuid: number | null;
  groupSize: number;
  members?: Array<{
    name: string;
    level: number;
    race: number;
    class: number;
    gender: number;
    faction: 'alliance' | 'horde';
    isHardcore: boolean;
  }>;
}

export interface MapData {
  azeroth: { alliance: number; horde: number; players: MapPlayer[] };
  outland: { alliance: number; horde: number; players: MapPlayer[] };
  northrend: { alliance: number; horde: number; players: MapPlayer[] };
}

export interface ServerStatusData {
  online: boolean;
  uptime: number;
  maxPlayers: number;
}

const HORDE_RACES = new Set([2, 5, 6, 8, 10]);
const ALLIANCE_RACES = new Set([1, 3, 4, 7, 11]);

// 副本列表：外域
const OUTLAND_INSTANCES = new Set([
  540, 542, 543, 544, 545, 546, 547, 548, 550, 552,
  553, 554, 555, 556, 557, 558, 559, 562, 564, 565,
]);

// 副本列表：诺森德
const NORTHREND_INSTANCES = new Set([
  533, 574, 575, 576, 578, 599, 600, 601, 602, 603,
  604, 608, 615, 616, 617, 619, 624, 631, 632, 649,
  650, 658, 668, 724,
]);

// 缩放系数
const SCALE_AZEROTH = 0.025140;
const SCALE_OUTLAND = 0.051446;
const SCALE_NORTHREND = 0.050085;

// 副本固定像素坐标（从 PHP PlayerMap 迁移）
const INSTANCE_COORDS: Record<number, Record<number, { x: number; y: number }>> = {
  // 艾泽拉斯副本
  0: {
    30: { x: 762, y: 278 }, 33: { x: 712, y: 295 }, 34: { x: 732, y: 511 },
    35: { x: 732, y: 503 }, 36: { x: 712, y: 567 }, 43: { x: 245, y: 419 },
    47: { x: 238, y: 508 }, 48: { x: 172, y: 291 }, 70: { x: 833, y: 443 },
    90: { x: 738, y: 419 }, 109: { x: 849, y: 551 }, 129: { x: 254, y: 516 },
    189: { x: 773, y: 216 }, 209: { x: 269, y: 568 }, 229: { x: 782, y: 481 },
    230: { x: 778, y: 484 }, 249: { x: 290, y: 514 }, 269: { x: 315, y: 601 },
    289: { x: 816, y: 258 }, 309: { x: 782, y: 589 }, 329: { x: 834, y: 203 },
    349: { x: 123, y: 432 }, 369: { x: 745, y: 497 }, 389: { x: 308, y: 352 },
    409: { x: 783, y: 484 }, 429: { x: 164, y: 496 }, 449: { x: 741, y: 508 },
    450: { x: 305, y: 352 }, 469: { x: 778, y: 480 }, 489: { x: 244, y: 364 },
    509: { x: 160, y: 607 }, 529: { x: 820, y: 321 }, 531: { x: 144, y: 603 },
    532: { x: 798, y: 569 }, 534: { x: 317, y: 596 }, 560: { x: 320, y: 606 },
    568: { x: 897, y: 172 }, 572: { x: 750, y: 245 }, 580: { x: 868, y: 26 },
    585: { x: 883, y: 16 }, 595: { x: 322, y: 601 }, 618: { x: 313, y: 348 },
  },
  // 外域副本
  1: {
    540: { x: 593, y: 399 }, 542: { x: 586, y: 398 }, 543: { x: 593, y: 405 },
    544: { x: 588, y: 402 }, 545: { x: 393, y: 355 }, 546: { x: 399, y: 350 },
    547: { x: 388, y: 353 }, 548: { x: 399, y: 357 }, 550: { x: 683, y: 226 },
    552: { x: 680, y: 215 }, 553: { x: 672, y: 210 }, 554: { x: 669, y: 239 },
    555: { x: 495, y: 569 }, 556: { x: 506, y: 557 }, 557: { x: 495, y: 545 },
    558: { x: 483, y: 557 }, 559: { x: 408, y: 489 }, 562: { x: 443, y: 239 },
    564: { x: 740, y: 567 }, 565: { x: 485, y: 204 },
  },
  // 诺森德副本
  2: {
    533: { x: 568, y: 456 }, 574: { x: 749, y: 577 }, 575: { x: 751, y: 583 },
    576: { x: 161, y: 443 }, 578: { x: 159, y: 451 }, 599: { x: 553, y: 195 },
    600: { x: 605, y: 406 }, 601: { x: 395, y: 462 }, 602: { x: 575, y: 180 },
    603: { x: 559, y: 169 }, 604: { x: 740, y: 292 }, 608: { x: 470, y: 360 },
    615: { x: 491, y: 465 }, 616: { x: 155, y: 447 }, 617: { x: 457, y: 352 },
    619: { x: 400, y: 462 }, 624: { x: 363, y: 369 }, 631: { x: 400, y: 350 },
    632: { x: 415, y: 350 }, 649: { x: 475, y: 207 }, 650: { x: 465, y: 207 },
    658: { x: 393, y: 362 }, 668: { x: 410, y: 365 }, 724: { x: 491, y: 455 },
  },
};

function getFactionByRace(race: number): 'alliance' | 'horde' {
  if (HORDE_RACES.has(race)) return 'horde';
  return 'alliance';
}

function getMapExtension(map: number): number {
  if (map === 530 || OUTLAND_INSTANCES.has(map)) {
    return 1;
  }
  if (map === 571 || NORTHREND_INSTANCES.has(map)) {
    return 2;
  }
  // 艾泽拉斯
  return 0;
}

function getInstancePixel(map: number): { x: number; y: number } | null {
  for (const [ext, coords] of Object.entries(INSTANCE_COORDS)) {
    if (coords[map]) {
      return coords[map];
    }
  }
  return null;
}

function convertWorldToPixel(x: number, y: number, map: number): { x: number; y: number } | null {
  x = Math.round(x);
  y = Math.round(y);

  // 副本返回固定像素坐标
  const instCoord = getInstancePixel(map);
  if (instCoord) {
    return instCoord;
  }

  let xpos: number;
  let ypos: number;
  let px: number;
  let py: number;

  if (map === 530) {
    // 外域 - 需要区分血精灵/德莱尼新手区
    if (y < -1000 && y > -10000 && x > 5000) {
      // 血精灵新手区
      x = x - 10349;
      y = y + 6357;
      xpos = Math.round(x * SCALE_OUTLAND);
      ypos = Math.round(y * SCALE_OUTLAND);
      px = 858 - ypos;
      py = 84 - xpos;
    } else if (y < -7000 && x < 0) {
      // 德莱尼新手区
      x = x + 3961;
      y = y + 13931;
      xpos = Math.round(x * SCALE_OUTLAND);
      ypos = Math.round(y * SCALE_OUTLAND);
      px = 103 - ypos;
      py = 261 - xpos;
    } else {
      // 外域主体
      x = x - 3070;
      y = y - 1265;
      xpos = Math.round(x * SCALE_OUTLAND);
      ypos = Math.round(y * SCALE_OUTLAND);
      px = 684 - ypos;
      py = 229 - xpos;
    }
  } else if (map === 571) {
    // 诺森德
    xpos = Math.round(x * SCALE_NORTHREND);
    ypos = Math.round(y * SCALE_NORTHREND);
    px = 505 - ypos;
    py = 642 - xpos;
  } else if (map === 609) {
    // 死亡骑士起始区
    x = x - 2355;
    y = y + 5662;
    xpos = Math.round(x * SCALE_AZEROTH);
    ypos = Math.round(y * SCALE_AZEROTH);
    px = 896 - ypos;
    py = 232 - xpos;
  } else if (map === 1) {
    // 卡利姆多
    xpos = Math.round(x * SCALE_AZEROTH);
    ypos = Math.round(y * SCALE_AZEROTH);
    px = 194 - ypos;
    py = 398 - xpos;
  } else {
    // 东部王国 (map=0) 或其他
    xpos = Math.round(x * SCALE_AZEROTH);
    ypos = Math.round(y * SCALE_AZEROTH);
    px = 752 - ypos;
    py = 291 - xpos;
  }

  return { x: px, y: py };
}

export class PlayerMapService {
  private cache = new CacheService();
  private repo = new PlayerMapRepository();

  async getMapData(): Promise<MapData> {
    const cacheKey = CacheKeys.playermapData;
    const cached = await this.cache.get<MapData>(cacheKey);
    if (cached) return cached;

    try {
      const rows = await this.repo.findOnlinePlayersWithPosition();
      const data = this.processPlayers(rows);
      await this.cache.set(cacheKey, data, CacheTTL.realtime);
      return data;
    } catch (err) {
      console.error('[PlayerMapService] getMapData failed:', err);
      return {
        azeroth: { alliance: 0, horde: 0, players: [] },
        outland: { alliance: 0, horde: 0, players: [] },
        northrend: { alliance: 0, horde: 0, players: [] },
      };
    }
  }

  async getServerStatus(): Promise<ServerStatusData> {
    const cacheKey = CacheKeys.playermapStatus;
    const cached = await this.cache.get<ServerStatusData>(cacheKey);
    if (cached) return cached;

    try {
      const rows = await this.repo.findServerStatus();
      const row = rows[0];
      const data: ServerStatusData = {
        online: Number(row?.online) === 1,
        uptime: Number(row?.uptime) || 0,
        maxPlayers: row?.maxplayers || 0,
      };
      await this.cache.set(cacheKey, data, CacheTTL.realtime);
      return data;
    } catch (err) {
      console.error('[PlayerMapService] getServerStatus failed:', err);
      return { online: false, uptime: 0, maxPlayers: 0 };
    }
  }

  private processPlayers(rows: any[]): MapData {
    const result: MapData = {
      azeroth: { alliance: 0, horde: 0, players: [] },
      outland: { alliance: 0, horde: 0, players: [] },
      northrend: { alliance: 0, horde: 0, players: [] },
    };

    // 先按位置分组：同一地图 + 相近坐标 → 聚合
    const groups = new Map<string, any[]>();

    for (const row of rows) {
      const faction = getFactionByRace(row.race);
      const ext = getMapExtension(row.map);
      const mapKey = ext === 0 ? 'azeroth' : ext === 1 ? 'outland' : 'northrend';

      result[mapKey][faction]++;

      const pos = convertWorldToPixel(row.position_x, row.position_y, row.map);
      if (pos) {
        // 世界地图上的玩家，检查是否靠近已有玩家
        const groupKey = this.findNearbyGroup(groups, row.map, pos.x, pos.y);
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push({ ...row, px: pos.x, py: pos.y });
      } else {
        // 副本中的玩家
        const groupKey = `inst-${row.map}`;
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push({ ...row, px: 0, py: 0, isInstance: true });
      }
    }

    // 将分组转换为 MapPlayer
    for (const [, members] of groups) {
      if (members.length === 0) continue;

      const first = members[0];
      const isInstance = first.isInstance;

      const player: MapPlayer = {
        name: members.length === 1 ? first.name : '',
        level: first.level,
        race: first.race,
        class: first.class,
        gender: first.gender,
        faction: getFactionByRace(first.race),
        x: isInstance ? 0 : first.px,
        y: isInstance ? 0 : first.py,
        map: first.map,
        zone: getZoneName(first.zone),
        isHardcore: Number(first.is_hardcore) === 1,
        groupGuid: first.groupGuid,
        groupSize: members.length,
        members: members.length > 1 ? members.map((m: any) => ({
          name: m.name,
          level: m.level,
          race: m.race,
          class: m.class,
          gender: m.gender,
          faction: getFactionByRace(m.race),
          isHardcore: Number(m.is_hardcore) === 1,
        })) : undefined,
      };

      const ext = getMapExtension(first.map);
      const mapKey = ext === 0 ? 'azeroth' : ext === 1 ? 'outland' : 'northrend';
      result[mapKey].players.push(player);
    }

    return result;
  }

  private findNearbyGroup(groups: Map<string, any[]>, map: number, x: number, y: number): string {
    for (const [key, members] of groups) {
      if (key.startsWith('inst-')) continue;
      const first = members[0];
      if (first.map === map) {
        const dx = first.px - x;
        const dy = first.py - y;
        if (Math.sqrt(dx * dx + dy * dy) < 3) {
          return key;
        }
      }
    }
    return `${map}-${x}-${y}`;
  }
}
