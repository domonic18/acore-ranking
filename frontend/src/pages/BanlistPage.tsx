import { useState } from 'react';
import { useBanlist, useMuteList } from '@/features/banlist/api/queries';
import { BanlistTabs, type TabKey } from '@/features/banlist/components/BanlistTabs';
import { BanlistTable } from '@/features/banlist/components/BanlistTable';
import { MuteListTable } from '@/features/banlist/components/MuteListTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function BanlistPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('bans');
  const banQuery = useBanlist();
  const muteQuery = useMuteList();
  const current = activeTab === 'bans' ? banQuery : muteQuery;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
        <BanlistTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {current.isLoading ? (
          <LoadingState />
        ) : current.error ? (
          <ErrorState message={current.error.message} />
        ) : activeTab === 'bans' && banQuery.data ? (
          <BanlistTable data={banQuery.data} />
        ) : activeTab === 'mutes' && muteQuery.data ? (
          <MuteListTable data={muteQuery.data} />
        ) : null}
      </main>
    </div>
  );
}
