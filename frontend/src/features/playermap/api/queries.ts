import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { MapData, ServerStatusData } from '../types';

export function usePlayerMapData() {
  return useQuery<MapData>({
    queryKey: ['playermap', 'players'],
    queryFn: () => apiClient.get(Endpoints.playermap.players),
    refetchInterval: 5000,
  });
}

export function usePlayerMapStatus() {
  return useQuery<ServerStatusData>({
    queryKey: ['playermap', 'status'],
    queryFn: () => apiClient.get(Endpoints.playermap.status),
    refetchInterval: 5000,
  });
}
