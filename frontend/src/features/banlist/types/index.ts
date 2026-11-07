export type BanType = 'account' | 'character';

export interface BanRecord {
  character_names: string;
  username: string;
  last_ip: string;
  bandate: string;
  unbandate: string;
  banreason: string;
  banType: BanType;
}

export interface MuteRecord {
  character_names: string;
  username: string;
  last_ip: string;
  mutedate: string;
  unmutetime: string;
  reason: string;
}
