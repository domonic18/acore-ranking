import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type {
  GoldRankPlayer,
  PlaytimeRankPlayer,
  HonorRankPlayer,
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
