export interface CharacterInfo {
  guid: number;
  name: string;
  level: number;
  race: number;
  class: number;
  gender: number;
  health: number;
  side: number;
  total_time: number;
  total_time_str: string;
  total_honor_points: number;
  arena_points: number;
  total_kills: number;
  quest_count: number;
  achievement_count: number;
}

export interface CharacterItem {
  item_guid: number;
  slot: number;
  item_entry: number;
  display_id: number;
  name: string;
  quality: number;
}
