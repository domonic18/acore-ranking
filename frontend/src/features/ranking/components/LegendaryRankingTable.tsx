import { QUALITY_COLORS } from '@/shared/constants/game';
import { ItemListRankingTable } from './ItemListRankingTable';
import type { LegendaryRankPlayer } from '../types';

const LEGENDARY_COLOR = QUALITY_COLORS[5];

interface LegendaryRankingTableProps {
  data: LegendaryRankPlayer[];
}

export function LegendaryRankingTable({ data }: LegendaryRankingTableProps) {
  return (
    <ItemListRankingTable
      data={data}
      countKey="legendary_count"
      countHeader="传说装备数"
      itemsKey="legendary_items"
      itemsHeader="装备"
      itemColor={LEGENDARY_COLOR}
    />
  );
}
