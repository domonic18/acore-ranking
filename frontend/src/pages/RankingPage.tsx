import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGoldRanking,
  usePlaytimeRanking,
  useHonorRanking,
  useAchievementRanking,
  useMountRanking,
} from '@/features/ranking/api/queries';
import { DataTable } from '@/shared/components/DataTable';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RACE_NAMES, CLASS_NAMES, CLASS_COLORS } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';

type TabKey = 'gold' | 'playtime' | 'honor' | 'achievement' | 'mount';

const baseColumns: ColumnDef<any>[] = [
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
];

const tabs: { key: TabKey; label: string }[] = [
  { key: 'gold', label: '财富排行' },
  { key: 'playtime', label: '时长排行' },
  { key: 'honor', label: '荣誉排行' },
  { key: 'achievement', label: '成就排行' },
  { key: 'mount', label: '坐骑排行' },
];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('gold');

  const gold = useGoldRanking();
  const playtime = usePlaytimeRanking();
  const honor = useHonorRanking();
  const achievement = useAchievementRanking();
  const mount = useMountRanking();

  const queries = { gold, playtime, honor, achievement, mount };
  const current = queries[activeTab];

  const extraColumns: Record<TabKey, ColumnDef<any>[]> = {
    gold: [{ accessorKey: 'total_gold_str', header: '金币' }],
    playtime: [{ accessorKey: 'total_spent_time_str', header: '游戏时间' }],
    honor: [
      { accessorKey: 'total_honor_points', header: '荣誉点' },
      { accessorKey: 'total_time_str', header: '游戏时间' },
    ],
    achievement: [{ accessorKey: 'total_achieve_points', header: '成就点' }],
    mount: [{ accessorKey: 'total_mount_counts', header: '坐骑数' }],
  };

  const columns = [...baseColumns, ...extraColumns[activeTab]];

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">综合排行</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {current.isLoading ? (
        <LoadingSpinner />
      ) : current.error ? (
        <ErrorMessage message={current.error.message} />
      ) : current.data ? (
        <DataTable data={current.data} columns={columns} />
      ) : null}
    </main>
  );
}
