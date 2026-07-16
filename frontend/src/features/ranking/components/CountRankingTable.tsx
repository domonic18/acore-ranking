import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { CountedRankPlayer } from '../types';

interface CountRankingTableProps<K extends string> {
  data: CountedRankPlayer<K>[];
  accessorKey: K;
  header: string;
}

export function CountRankingTable<K extends string>({ data, accessorKey, header }: CountRankingTableProps<K>) {
  const extraColumns: ColumnDef<CountedRankPlayer<K>>[] = [
    {
      accessorKey,
      header,
    },
  ];
  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
