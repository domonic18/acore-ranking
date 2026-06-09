import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type { AuctionItem } from '../types';

export function useAuctionList() {
  return useQuery<AuctionItem[]>({
    queryKey: ['auction', 'list'],
    queryFn: () => apiClient.get(Endpoints.auction.list),
  });
}
