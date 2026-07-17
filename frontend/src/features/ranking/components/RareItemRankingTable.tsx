import { QUALITY_COLORS } from '@/shared/constants/game';
import { ItemListRankingTable } from './ItemListRankingTable';
import type { RareItemRankPlayer } from '../types';

const RARE_ITEM_COLOR = QUALITY_COLORS[4];

interface RareItemRankingTableProps {
  data: RareItemRankPlayer[];
}

export function RareItemRankingTable({ data }: RareItemRankingTableProps) {
  return (
    <ItemListRankingTable
      data={data}
      countKey="rare_item_count"
      countHeader="稀有物品数"
      itemsKey="rare_items"
      itemsHeader="物品"
      itemColor={RARE_ITEM_COLOR}
    />
  );
}
