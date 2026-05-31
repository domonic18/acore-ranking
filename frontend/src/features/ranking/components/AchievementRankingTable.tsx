import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RaceIcon, ClassIcon } from '@/shared/components/RaceClassIcons';
import type { ColumnDef } from '@tanstack/react-table';
import type { AchievementRankPlayer } from '../types';

const columns: ColumnDef<AchievementRankPlayer>[] = [
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
    meta: { className: 'hidden md:table-cell' },
    cell: ({ row }) => (
      <RaceIcon race={row.original.race} gender={row.original.gender} size={24} />
    ),
  },
  {
    accessorKey: 'class',
    header: '职业',
    cell: ({ row }) => (
      <ClassIcon class={row.original.class} size={24} />
    ),
  },
  { accessorKey: 'level', header: '等级' },
  {
    accessorKey: 'side',
    header: '阵营',
    meta: { className: 'hidden md:table-cell' },
    cell: ({ row }) => <FactionBadge side={row.original.side} />,
  },
  { accessorKey: 'total_achieve_points', header: '成就点' },
];

interface AchievementRankingTableProps {
  data: AchievementRankPlayer[];
}

export function AchievementRankingTable({ data }: AchievementRankingTableProps) {
  return <DataTable data={data} columns={columns} />;
}
