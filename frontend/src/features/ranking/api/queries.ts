import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type {
  GoldRankPlayer,
  PlaytimeRankPlayer,
  HonorRankPlayer,
  KillsRankPlayer,
  DeathRankPlayer,
  ReputationRankPlayer,
  QuestRankPlayer,
  LegendaryRankPlayer,
  TodayKillsRankPlayer,
  AchievementRankPlayer,
  MountRankPlayer,
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
