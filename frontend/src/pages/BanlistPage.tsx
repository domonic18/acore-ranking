import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanlist, useMuteList } from '@/features/banlist/api/queries';
import { BanlistTabs, type TabKey } from '@/features/banlist/components/BanlistTabs';
import { BanlistTable } from '@/features/banlist/components/BanlistTable';
import { MuteListTable } from '@/features/banlist/components/MuteListTable';
import { LogoIcon } from '@/shared/components/ui/LogoIcon';
import { SHORT_VERSION } from '@/shared/config/version';
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
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/" className="hidden md:flex items-center gap-2">
            <LogoIcon className="h-8 w-8" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold">泰坦之眼</span>
              <span className="text-[10px] text-muted-foreground">{SHORT_VERSION}</span>
            </div>
          </Link>
          <BanlistTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

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
