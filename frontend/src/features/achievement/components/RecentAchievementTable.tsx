import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { RACE_NAMES, CLASS_NAMES, CLASS_COLORS, GENDER_NAMES } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';
import type { RecentAchievement } from '../types';

const columns: ColumnDef<RecentAchievement>[] = [
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
    accessorKey: 'gender',
    header: '性别',
    cell: ({ row }) => GENDER_NAMES[row.original.gender] ?? row.original.gender,
  },
  { accessorKey: 'achievement_description', header: '成就' },
  { accessorKey: 'achievement_date', header: '日期' },
];

interface RecentAchievementTableProps {
  data: RecentAchievement[];
}

export function RecentAchievementTable({ data }: RecentAchievementTableProps) {
  return <DataTable data={data} columns={columns} />;
}
