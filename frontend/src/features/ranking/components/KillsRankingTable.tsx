import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { KillsRankPlayer } from '../types';

const extraColumns: ColumnDef<KillsRankPlayer>[] = [
  { accessorKey: 'total_time_str', header: '游戏时间' },
  { accessorKey: 'total_kills', header: '击杀数' },
];

interface KillsRankingTableProps {
  data: KillsRankPlayer[];
}

export function KillsRankingTable({ data }: KillsRankingTableProps) {
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
