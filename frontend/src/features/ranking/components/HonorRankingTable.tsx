import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { HonorRankPlayer } from '../types';

const extraColumns: ColumnDef<HonorRankPlayer>[] = [
  { accessorKey: 'total_time_str', header: '游戏时间' },
  { accessorKey: 'total_honor_points', header: '荣誉点数' },
];

interface HonorRankingTableProps {
  data: HonorRankPlayer[];
}

export function HonorRankingTable({ data }: HonorRankingTableProps) {
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
