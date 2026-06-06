import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { FirstKillRecord } from '../types';

export function useFirstKills() {
  return useQuery<FirstKillRecord[]>({
    queryKey: ['encounter', 'bosses'],
    queryFn: () => apiClient.get(Endpoints.encounter.bosses),
  });
}
