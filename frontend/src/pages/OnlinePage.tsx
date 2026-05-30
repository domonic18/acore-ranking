import { Link } from 'react-router-dom';
import { useOnlineCount, useOnlinePlayers } from '@/features/online/api/queries';
import { DataTable } from '@/shared/components/DataTable';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RACE_NAMES, CLASS_NAMES, CLASS_COLORS, GENDER_NAMES } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';
import type { OnlinePlayer } from '@/features/online/types';

const playerColumns: ColumnDef<OnlinePlayer>[] = [
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
  {
    accessorKey: 'side',
    header: '阵营',
    cell: ({ row }) => <FactionBadge side={row.original.side} />,
  },
];

export default function OnlinePage() {
  const { data: count, isLoading: countLoading, error: countError } = useOnlineCount();
  const { data: players, isLoading: playersLoading, error: playersError } = useOnlinePlayers();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">在线玩家</h1>

      {countLoading ? (
        <LoadingSpinner />
      ) : countError ? (
        <ErrorMessage message={countError.message} />
      ) : count ? (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-3xl font-bold text-primary">{count.total_count}</div>
            <div className="text-sm text-muted-foreground">在线总数</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-3xl font-bold text-alliance">{count.alliance_count}</div>
            <div className="text-sm text-muted-foreground">联盟</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <div className="text-3xl font-bold text-horde">{count.horde_count}</div>
            <div className="text-sm text-muted-foreground">部落</div>
          </div>
        </div>
      ) : null}

      <h2 className="mb-2 text-lg font-semibold">在线角色列表</h2>
      {playersLoading ? (
        <LoadingSpinner />
      ) : playersError ? (
        <ErrorMessage message={playersError.message} />
      ) : players ? (
        <DataTable data={players} columns={playerColumns} />
      ) : null}
    </main>
  );
}
