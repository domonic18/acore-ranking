export interface MapPlayerMember {
  name: string;
  level: number;
  race: number;
  class: number;
  gender: number;
  faction: 'alliance' | 'horde';
  isHardcore: boolean;
}

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
  members?: MapPlayerMember[];
}

export interface MapSection {
  alliance: number;
  horde: number;
  players: MapPlayer[];
}

export interface MapData {
  azeroth: MapSection;
  outland: MapSection;
  northrend: MapSection;
}

export interface ServerStatusData {
  online: boolean;
  uptime: number;
  maxPlayers: number;
}
