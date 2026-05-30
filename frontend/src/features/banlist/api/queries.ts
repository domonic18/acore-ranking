import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { BanRecord } from '../types';

export function useBanlist() {
  return useQuery<BanRecord[]>({
    queryKey: ['banlist', 'recent'],
    queryFn: () => apiClient.get(Endpoints.banlist.recent),
  });
}
