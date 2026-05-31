import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { OnlineCount, OnlinePlayer, WidgetConfig } from '../types';

export function useWidgetConfig() {
  return useQuery<WidgetConfig>({
    queryKey: ['config', 'widget'],
    queryFn: () => apiClient.get(Endpoints.config.widget),
    staleTime: Infinity,
  });
}

export function useOnlineCount() {
  return useQuery<OnlineCount>({
    queryKey: ['online', 'count'],
    queryFn: () => apiClient.get(Endpoints.online.count),
  });
}

export function useOnlinePlayers() {
  return useQuery<OnlinePlayer[]>({
    queryKey: ['online', 'players'],
    queryFn: () => apiClient.get(Endpoints.online.players),
  });
}
