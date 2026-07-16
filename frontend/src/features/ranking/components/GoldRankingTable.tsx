import { GoldDisplay } from '@/shared/components/GoldDisplay';
import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { GoldRankPlayer } from '../types';

const extraColumns: ColumnDef<GoldRankPlayer>[] = [
  {
    accessorKey: 'total_gold',
    header: '金币',
    cell: ({ row }) => <GoldDisplay copper={row.original.total_gold} />,
  },
];

interface GoldRankingTableProps {
  data: GoldRankPlayer[];
}

export function GoldRankingTable({ data }: GoldRankingTableProps) {
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
