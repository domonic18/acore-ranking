import { useState } from 'react';
import {
  useHardcoreCompleted,
  useHardcoreFail,
  useHardcoreIncomplete,
} from '@/features/hardcore/api/queries';
import { DataTable } from '@/shared/components/DataTable';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RACE_NAMES, CLASS_NAMES, CLASS_COLORS, GENDER_NAMES } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';
import type { HardcorePlayer } from '@/features/hardcore/types';

type TabKey = 'completed60' | 'completed70' | 'fail' | 'incomplete';

const columns: ColumnDef<HardcorePlayer>[] = [
  { accessorKey: 'name', header: '角色名' },
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
  { accessorKey: 'total_spent_time_str', header: '耗时' },
];

const tabs: { key: TabKey; label: string; level?: number }[] = [
  { key: 'completed60', label: '完成 60 级', level: 60 },
  { key: 'completed70', label: '完成 70 级', level: 70 },
  { key: 'fail', label: '挑战失败' },
  { key: 'incomplete', label: '进行中' },
];

export default function HardcorePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('completed60');

  const completed60 = useHardcoreCompleted(60);
  const completed70 = useHardcoreCompleted(70);
  const fail = useHardcoreFail();
  const incomplete = useHardcoreIncomplete();

  const queries = { completed60, completed70, fail, incomplete };
  const current = queries[activeTab];

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">硬核挑战</h1>

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
