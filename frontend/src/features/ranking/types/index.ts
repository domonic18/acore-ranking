export interface RankPlayer {
  guid: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
  side: number;
}

export type CountedRankPlayer<K extends string> = RankPlayer & Record<K, number>;

export interface GoldRankPlayer extends RankPlayer {
  total_gold: number;
  total_gold_str: string;
}

export interface PlaytimeRankPlayer extends RankPlayer {
  total_spent_time: number;
  total_spent_time_str: string;
}

export interface HonorRankPlayer extends RankPlayer {
  total_time: number;
  total_time_str: string;
  total_honor_points: number;
}

export interface KillsRankPlayer extends RankPlayer {
  total_time: number;
  total_time_str: string;
  total_kills: number;
}

export type DeathRankPlayer = CountedRankPlayer<'death_count'>;

export type MonsterKillRankPlayer = CountedRankPlayer<'monster_kill_count'>;

export type CritterKillRankPlayer = CountedRankPlayer<'critter_kill_count'>;

export type FlightPathRankPlayer = CountedRankPlayer<'flight_path_count'>;

export type HealingPotionRankPlayer = CountedRankPlayer<'healing_potion_count'>;

export interface ReputationRankPlayer extends RankPlayer {
  total_reputation: number;
  exalted_count: number;
}

export type QuestRankPlayer = CountedRankPlayer<'quest_count'>;

export interface LegendaryItem {
  name: string;
  display_id: number;
  item_entry: number;
  icon: string | null;
}

export interface LegendaryRankPlayer extends RankPlayer {
  legendary_count: number;
  legendary_items: LegendaryItem[];
}

export type TodayKillsRankPlayer = CountedRankPlayer<'today_kills'>;

export type AchievementRankPlayer = CountedRankPlayer<'total_achieve_points'>;

export interface MountRankPlayer extends RankPlayer {
  total_mount_counts: number;
  mount_ids: string;
}

export type Dungeon5RankPlayer = CountedRankPlayer<'dungeon_5_count'>;

export type Raid10RankPlayer = CountedRankPlayer<'raid_10_count'>;

export type Raid25RankPlayer = CountedRankPlayer<'raid_25_count'>;
