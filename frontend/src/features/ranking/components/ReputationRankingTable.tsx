import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReputationRankPlayer } from '../types';

const extraColumns: ColumnDef<ReputationRankPlayer>[] = [
  { accessorKey: 'total_reputation', header: '总声望' },
  { accessorKey: 'exalted_count', header: '崇拜阵营' },
];

interface ReputationRankingTableProps {
  data: ReputationRankPlayer[];
}

export function ReputationRankingTable({ data }: ReputationRankingTableProps) {
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
