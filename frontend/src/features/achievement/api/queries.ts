import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { RecentAchievement } from '../types';

export function useRecentAchievements() {
  return useQuery<RecentAchievement[]>({
    queryKey: ['achievement', 'recent'],
    queryFn: () => apiClient.get(Endpoints.achievement.recent),
  });
}
