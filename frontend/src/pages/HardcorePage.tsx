import { useState } from 'react';
import {
  useHardcoreCompleted,
  useHardcoreFail,
  useHardcoreIncomplete,
} from '@/features/hardcore/api/queries';
import { HardcoreTabs, type TabKey } from '@/features/hardcore/components/HardcoreTabs';
import { CompletedTable } from '@/features/hardcore/components/CompletedTable';
import { FailedTable } from '@/features/hardcore/components/FailedTable';
import { IncompleteTable } from '@/features/hardcore/components/IncompleteTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function HardcorePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('fail');

  const completed60 = useHardcoreCompleted(60);
  const completed70 = useHardcoreCompleted(70);
  const completed80 = useHardcoreCompleted(80);
  const fail = useHardcoreFail();
  const incomplete = useHardcoreIncomplete();

  const queries = { completed60, completed70, completed80, fail, incomplete };
  const current = queries[activeTab];

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <HardcoreTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {current.isLoading ? (
        <LoadingState />
      ) : current.error ? (
        <ErrorState message={current.error.message} />
      ) : current.data ? (
        <>
          {activeTab === 'completed60' && <CompletedTable data={current.data} levelHeader="级别" />}
          {activeTab === 'completed70' && <CompletedTable data={current.data} levelHeader="级别" />}
          {activeTab === 'completed80' && <CompletedTable data={current.data} levelHeader="级别" />}
          {activeTab === 'fail' && <FailedTable data={current.data} levelHeader="级别" />}
          {activeTab === 'incomplete' && <IncompleteTable data={current.data} levelHeader="级别" />}
        </>
      ) : null}
    </main>
  );
}
