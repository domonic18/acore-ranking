import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { FirstKillRecord } from '../types';

const PlayersCell = ({ players }: { players: string[] }) => {
  if (!players.length) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5 max-w-[320px]">
      {players.map((name) => (
        <Link
          key={name}
          to={`/character/${encodeURIComponent(name)}`}
          className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
        >
          {name}
        </Link>
      ))}
    </div>
  );
};

const columns: ColumnDef<FirstKillRecord>[] = [
  {
    accessorKey: 'boss_name',
    header: 'Boss',
    cell: (info) => (
      <span className="font-semibold text-foreground">{String(info.getValue() || '')}</span>
    ),
    meta: { className: 'min-w-[140px]' },
  },
  {
    accessorKey: 'first_kill',
    header: '首杀时间',
    meta: { className: 'min-w-[150px] whitespace-nowrap' },
  },
  {
    accessorKey: 'first_kill_players',
    header: '首杀团队',
    cell: (info) => <PlayersCell players={info.getValue() as string[]} />,
    meta: { className: 'min-w-[200px]' },
  },
  {
    accessorKey: 'kill_count',
    header: '总击杀次数',
    meta: { className: 'min-w-[100px]' },
  },
];

interface FirstKillsTableProps {
  data: FirstKillRecord[];
}

export function FirstKillsTable({ data }: FirstKillsTableProps) {
  return <DataTable data={data} columns={columns} />;
}
