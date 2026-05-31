import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { CharacterInfo, CharacterItem, CharacterTalents, CharacterAchievements } from '../types';

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

export function useCharacterTalents(name: string) {
  return useQuery<CharacterTalents | null>({
    queryKey: ['character', 'talents', name],
    queryFn: () => apiClient.get(Endpoints.character.talents(name)),
    enabled: !!name,
  });
}

export function useCharacterAchievements(name: string) {
  return useQuery<CharacterAchievements | null>({
    queryKey: ['character', 'achievements', name],
    queryFn: () => apiClient.get(Endpoints.character.achievements(name)),
    enabled: !!name,
  });
}
