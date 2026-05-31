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
  guild: string | null;
  creation_date: string;
  last_login: string;
}

export interface CharacterItem {
  item_guid: number;
  slot: number;
  item_entry: number;
  display_id: number;
  name: string;
  quality: number;
  icon: string | null;
}

export interface TalentSpell {
  id: number;
  tierId: number;
  columnIndex: number;
  spellRank0: number;
  spellRank1: number;
  spellRank2: number;
  spellRank3: number;
  spellRank4: number;
  prereqTalent0: number;
  icon: string | null;
}

export interface TalentTree {
  name: string;
  iconId: number;
  icon: string | null;
  spells: TalentSpell[];
}

export interface CharacterTalents {
  trees: TalentTree[];
  talents: number[][];
  glyphs: number[][];
}

export interface Achievement {
  id: number;
  category: number;
  title: string;
  description: string;
  points: number;
  icon: string | null;
}

export interface AchievementCategory {
  id: number;
  parent: number;
  name: string;
}

export interface CharacterAchievements {
  achievements: Achievement[];
  categories: AchievementCategory[];
  earned: Record<number, number>;
  totalPoints: number;
}
