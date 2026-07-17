import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { PlaytimeRankPlayer } from '../types';

const extraColumns: ColumnDef<PlaytimeRankPlayer>[] = [
  { accessorKey: 'total_spent_time_str', header: '游戏时间' },
];

interface PlaytimeRankingTableProps {
  data: PlaytimeRankPlayer[];
}

export function PlaytimeRankingTable({ data }: PlaytimeRankingTableProps) {
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
