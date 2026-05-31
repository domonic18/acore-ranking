import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { RaceIcon, ClassIcon } from '@/shared/components/RaceClassIcons';
import type { ColumnDef } from '@tanstack/react-table';
import type { HardcorePlayer } from '../types';

function getColumns(levelHeader: string): ColumnDef<HardcorePlayer>[] {
  return [
    {
      accessorKey: 'name',
      header: '名字',
      cell: ({ row }) => (
        <Link
          to={`/character/${encodeURIComponent(row.original.name)}`}
          className="text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: 'level', header: levelHeader },
    {
      accessorKey: 'class',
      header: '职业',
      cell: ({ row }) => (
        <ClassIcon class={row.original.class} size={24} />
      ),
    },
    {
      accessorKey: 'race',
      header: '种族',
      cell: ({ row }) => (
        <RaceIcon race={row.original.race} gender={row.original.gender} size={24} />
      ),
    },
    { accessorKey: 'total_spent_time_str', header: '游戏时间' },
  ];
}

interface FailedTableProps {
  data: HardcorePlayer[];
  levelHeader: string;
}

export function FailedTable({ data, levelHeader }: FailedTableProps) {
  return <DataTable data={data} columns={getColumns(levelHeader)} />;
}
