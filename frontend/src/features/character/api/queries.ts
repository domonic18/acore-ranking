import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { CharacterInfo, CharacterItem } from '../types';

export function useCharacterInfo(name: string) {
  return useQuery<CharacterInfo | null>({
    queryKey: ['character', 'info', name],
    queryFn: () => apiClient.get(Endpoints.character.info(name)),
    enabled: !!name,
  });
}

export function useCharacterItems(name: string) {
  return useQuery<CharacterItem[]>({
    queryKey: ['character', 'items', name],
    queryFn: () => apiClient.get(Endpoints.character.items(name)),
    enabled: !!name,
  });
}
