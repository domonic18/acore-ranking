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
}

export interface WidgetConfig {
  detailUrl: string;
  onlineUrl: string;
}
