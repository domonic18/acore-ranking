import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type {
  GoldRankPlayer,
  PlaytimeRankPlayer,
  HonorRankPlayer,
  KillsRankPlayer,
  DeathRankPlayer,
  MonsterKillRankPlayer,
  CritterKillRankPlayer,
  FlightPathRankPlayer,
  HealingPotionRankPlayer,
  ReputationRankPlayer,
  QuestRankPlayer,
  LegendaryRankPlayer,
  TodayKillsRankPlayer,
  AchievementRankPlayer,
  MountRankPlayer,
  Dungeon5RankPlayer,
  Raid10RankPlayer,
  Raid25RankPlayer,
} from '../types';

export function useGoldRanking() {
  return useQuery<GoldRankPlayer[]>({
    queryKey: ['ranking', 'gold'],
    queryFn: () => apiClient.get(Endpoints.ranking.gold),
  });
}

export function usePlaytimeRanking() {
  return useQuery<PlaytimeRankPlayer[]>({
    queryKey: ['ranking', 'playtime'],
    queryFn: () => apiClient.get(Endpoints.ranking.playtime),
  });
}

export function useHonorRanking() {
  return useQuery<HonorRankPlayer[]>({
    queryKey: ['ranking', 'honor'],
    queryFn: () => apiClient.get(Endpoints.ranking.honor),
  });
}

export function useKillsRanking() {
  return useQuery<KillsRankPlayer[]>({
    queryKey: ['ranking', 'kills'],
    queryFn: () => apiClient.get(Endpoints.ranking.kills),
  });
}

export function useDeathRanking() {
  return useQuery<DeathRankPlayer[]>({
    queryKey: ['ranking', 'deaths'],
    queryFn: () => apiClient.get(Endpoints.ranking.deaths),
  });
}

export function useMonsterKillRanking() {
  return useQuery<MonsterKillRankPlayer[]>({
    queryKey: ['ranking', 'monsterKills'],
    queryFn: () => apiClient.get(Endpoints.ranking.monsterKills),
  });
}

export function useCritterKillRanking() {
  return useQuery<CritterKillRankPlayer[]>({
    queryKey: ['ranking', 'critterKills'],
    queryFn: () => apiClient.get(Endpoints.ranking.critterKills),
  });
}

export function useFlightPathRanking() {
  return useQuery<FlightPathRankPlayer[]>({
    queryKey: ['ranking', 'flightPaths'],
    queryFn: () => apiClient.get(Endpoints.ranking.flightPaths),
  });
}

export function useHealingPotionRanking() {
  return useQuery<HealingPotionRankPlayer[]>({
    queryKey: ['ranking', 'healingPotions'],
    queryFn: () => apiClient.get(Endpoints.ranking.healingPotions),
  });
}

export function useReputationRanking() {
  return useQuery<ReputationRankPlayer[]>({
    queryKey: ['ranking', 'reputation'],
    queryFn: () => apiClient.get(Endpoints.ranking.reputation),
  });
}

export function useQuestRanking() {
  return useQuery<QuestRankPlayer[]>({
    queryKey: ['ranking', 'quest'],
    queryFn: () => apiClient.get(Endpoints.ranking.quest),
  });
}

export function useLegendaryRanking() {
  return useQuery<LegendaryRankPlayer[]>({
    queryKey: ['ranking', 'legendary'],
    queryFn: () => apiClient.get(Endpoints.ranking.legendary),
  });
}

export function useTodayKillsRanking() {
  return useQuery<TodayKillsRankPlayer[]>({
    queryKey: ['ranking', 'todayKills'],
    queryFn: () => apiClient.get(Endpoints.ranking.todayKills),
  });
}

export function useAchievementRanking() {
  return useQuery<AchievementRankPlayer[]>({
    queryKey: ['ranking', 'achievement'],
    queryFn: () => apiClient.get(Endpoints.ranking.achievement),
  });
}

export function useMountRanking() {
  return useQuery<MountRankPlayer[]>({
    queryKey: ['ranking', 'mount'],
    queryFn: () => apiClient.get(Endpoints.ranking.mount),
  });
}

export function useDungeon5Ranking() {
  return useQuery<Dungeon5RankPlayer[]>({
    queryKey: ['ranking', 'dungeon5'],
    queryFn: () => apiClient.get(Endpoints.ranking.dungeon5),
  });
}

export function useRaid10Ranking() {
  return useQuery<Raid10RankPlayer[]>({
    queryKey: ['ranking', 'raid10'],
    queryFn: () => apiClient.get(Endpoints.ranking.raid10),
  });
}

export function useRaid25Ranking() {
  return useQuery<Raid25RankPlayer[]>({
    queryKey: ['ranking', 'raid25'],
    queryFn: () => apiClient.get(Endpoints.ranking.raid25),
  });
}
