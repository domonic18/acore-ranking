import type { OnlinePlayer } from '../types';

/** 统计每个登录 IP 的在线角色数（无 IP 的角色不参与统计） */
export function countByIp(players: OnlinePlayer[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of players) {
    if (!p.ip) continue;
    counts.set(p.ip, (counts.get(p.ip) || 0) + 1);
  }
  return counts;
}

export interface MultiBoxStats {
  /** 同 IP ≥2 个在线角色的 IP 组数 */
  groups: number;
  /** 涉及的在线角色总数 */
  players: number;
}

export function getMultiBoxStats(ipCounts: Map<string, number>): MultiBoxStats {
  let groups = 0;
  let players = 0;
  for (const count of ipCounts.values()) {
    if (count >= 2) {
      groups += 1;
      players += count;
    }
  }
  return { groups, players };
}

export function isMultiBox(p: OnlinePlayer, ipCounts: Map<string, number>): boolean {
  return !!p.ip && (ipCounts.get(p.ip) || 0) >= 2;
}
