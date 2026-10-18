export interface OnlineCount {
  total_count: number;
  alliance_count: number;
  horde_count: number;
}

export interface OnlinePlayer {
  guid: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
  side: number;
  /** 掩码后的登录 IP（如 1.2.3.*），空串表示未知 */
  ip: string;
}

export interface WidgetConfig {
  detailUrl: string;
  onlineUrl: string;
}
