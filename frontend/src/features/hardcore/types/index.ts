export interface HardcorePlayer {
  guid: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
  side: number;
  total_spent_time: number;
  total_spent_time_str: string;
  death_reason?: string;
  death_location?: string;
}
