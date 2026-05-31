import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { HardcorePlayer } from '../types';

export function useHardcoreCompleted(level: number) {
  return useQuery<HardcorePlayer[]>({
    queryKey: ['hardcore', 'completed', level],
    queryFn: () => apiClient.get(Endpoints.hardcore.completed(level)),
  });
}

export function useHardcoreFail() {
  return useQuery<HardcorePlayer[]>({
    queryKey: ['hardcore', 'fail'],
    queryFn: () => apiClient.get(Endpoints.hardcore.fail),
  });
}

export function useHardcoreIncomplete() {
  return useQuery<HardcorePlayer[]>({
    queryKey: ['hardcore', 'incomplete'],
    queryFn: () => apiClient.get(Endpoints.hardcore.incomplete),
  });
}
