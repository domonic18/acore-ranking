export interface RankPlayer {
  guid: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
  side: number;
}

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

export interface DeathRankPlayer extends RankPlayer {
  death_count: number;
}

export interface ReputationRankPlayer extends RankPlayer {
  total_reputation: number;
  exalted_count: number;
}

export interface QuestRankPlayer extends RankPlayer {
  quest_count: number;
}

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

export interface TodayKillsRankPlayer extends RankPlayer {
  today_kills: number;
}

export interface YesterdayKillsRankPlayer extends RankPlayer {
  yesterday_kills: number;
}

export interface AchievementRankPlayer extends RankPlayer {
  total_achieve_points: number;
}

export interface MountRankPlayer extends RankPlayer {
  total_mount_counts: number;
  mount_ids: string;
}
