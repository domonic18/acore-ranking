import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { MountRankPlayer } from '../types';

const extraColumns: ColumnDef<MountRankPlayer>[] = [
  { accessorKey: 'total_mount_counts', header: '坐骑数' },
];

interface MountRankingTableProps {
  data: MountRankPlayer[];
}

export function MountRankingTable({ data }: MountRankingTableProps) {
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
