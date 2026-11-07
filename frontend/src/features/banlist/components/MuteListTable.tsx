import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { MuteRecord } from '../types';
import { BanReasonCell, CharacterNamesCell } from './BanlistTable';

const columns: ColumnDef<MuteRecord>[] = [
  {
    accessorKey: 'character_names',
    header: '角色名',
    cell: (info) => <CharacterNamesCell value={String(info.getValue() || '')} />,
    meta: { className: 'min-w-[140px]' },
  },
  {
    accessorKey: 'username',
    header: '所属账号',
    meta: { className: 'min-w-[120px]' },
  },
  {
    accessorKey: 'last_ip',
    header: '最后 IP',
    meta: { className: 'min-w-[110px]' },
  },
  {
    accessorKey: 'reason',
    header: '禁言原因',
    cell: (info) => <BanReasonCell value={String(info.getValue() || '')} />,
    meta: { className: 'min-w-[180px] max-w-[280px]' },
  },
  {
    accessorKey: 'mutedate',
    header: '禁言时间',
    meta: { className: 'min-w-[150px] whitespace-nowrap' },
  },
  {
    accessorKey: 'unmutetime',
    header: '解禁时间',
    meta: { className: 'min-w-[150px] whitespace-nowrap' },
  },
];

interface MuteListTableProps {
  data: MuteRecord[];
}

export function MuteListTable({ data }: MuteListTableProps) {
  return <DataTable data={data} columns={columns} refreshHint={null} />;
}
