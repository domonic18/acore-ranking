import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { BanRecord, MuteRecord } from '../types';

export function useBanlist() {
  return useQuery<BanRecord[]>({
    queryKey: ['banlist', 'recent'],
    queryFn: () => apiClient.get(Endpoints.banlist.recent),
  });
}

export function useMuteList() {
  return useQuery<MuteRecord[]>({
    queryKey: ['banlist', 'mutes'],
    queryFn: () => apiClient.get(Endpoints.banlist.mutes),
  });
}
