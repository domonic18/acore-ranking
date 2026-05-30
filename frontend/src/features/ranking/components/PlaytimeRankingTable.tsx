import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RACE_NAMES, CLASS_NAMES, CLASS_COLORS } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';
import type { PlaytimeRankPlayer } from '../types';

const columns: ColumnDef<PlaytimeRankPlayer>[] = [
  {
    accessorKey: 'name',
    header: '角色名',
    cell: ({ row }) => (
      <Link
        to={`/character/${encodeURIComponent(row.original.name)}`}
        className="text-primary hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'race',
    header: '种族',
    cell: ({ row }) => RACE_NAMES[row.original.race] ?? row.original.race,
  },
  {
    accessorKey: 'class',
    header: '职业',
    cell: ({ row }) => (
      <span style={{ color: CLASS_COLORS[row.original.class] ?? '#fff' }}>
        {CLASS_NAMES[row.original.class] ?? row.original.class}
      </span>
    ),
  },
  { accessorKey: 'level', header: '等级' },
  {
    accessorKey: 'side',
    header: '阵营',
    cell: ({ row }) => <FactionBadge side={row.original.side} />,
  },
  { accessorKey: 'total_spent_time_str', header: '游戏时间' },
];

interface PlaytimeRankingTableProps {
  data: PlaytimeRankPlayer[];
}

export function PlaytimeRankingTable({ data }: PlaytimeRankingTableProps) {
  return <DataTable data={data} columns={columns} />;
}
