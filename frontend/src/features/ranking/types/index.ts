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

export interface AchievementRankPlayer extends RankPlayer {
  total_achieve_points: number;
}

export interface MountRankPlayer extends RankPlayer {
  total_mount_counts: number;
  mount_ids: string;
}
