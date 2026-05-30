import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { BanRecord } from '../types';

const columns: ColumnDef<BanRecord>[] = [
  { accessorKey: 'username', header: '账号' },
  { accessorKey: 'last_ip', header: '最后 IP' },
  { accessorKey: 'banreason', header: '封禁原因' },
  { accessorKey: 'bandate', header: '封禁时间' },
  { accessorKey: 'unbandate', header: '解封时间' },
];

interface BanlistTableProps {
  data: BanRecord[];
}

export function BanlistTable({ data }: BanlistTableProps) {
  return <DataTable data={data} columns={columns} />;
}
