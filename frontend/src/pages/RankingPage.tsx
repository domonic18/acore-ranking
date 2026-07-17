import { useState } from 'react';
import { RankingTabs, type TabKey } from '@/features/ranking/components/RankingTabs';
import { rankingConfig, rankingConfigMap } from '@/features/ranking/rankingConfig';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('gold');

  const queries = Object.fromEntries(
    rankingConfig.map((c) => [c.key, c.useQuery()]),
  ) as Record<TabKey, ReturnType<typeof rankingConfig[number]['useQuery']>>;

  const current = queries[activeTab];
  const activeConfig = rankingConfigMap.get(activeTab)!;
  const TableComponent = activeConfig.component;

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <RankingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {current.isLoading ? (
        <LoadingState />
      ) : current.error ? (
        <ErrorState message={current.error.message} />
      ) : current.data ? (
        <TableComponent data={current.data} />
      ) : null}
    </main>
  );
}
