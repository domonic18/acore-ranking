import { useMemo, useState } from 'react';
import { useOnlineCount, useOnlinePlayers } from '@/features/online/api/queries';
import { OnlineCountCard } from '@/features/online/components/OnlineCountCard';
import { OnlinePlayerTable } from '@/features/online/components/OnlinePlayerTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';
import { countByIp, getMultiBoxStats, isMultiBox } from '@/features/online/utils/multiBox';

export default function OnlinePage() {
  const { data: count, isLoading: countLoading, error: countError } = useOnlineCount();
  const { data: players, isLoading: playersLoading, error: playersError } = useOnlinePlayers();
  const [onlyMulti, setOnlyMulti] = useState(false);

  const ipCounts = useMemo(() => countByIp(players ?? []), [players]);
  const multiBoxStats = useMemo(() => getMultiBoxStats(ipCounts), [ipCounts]);

  const visiblePlayers = useMemo(
    () => (onlyMulti ? (players ?? []).filter((p) => isMultiBox(p, ipCounts)) : players),
    [onlyMulti, players, ipCounts],
  );

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">在线玩家</h1>

      {countLoading ? (
        <LoadingState />
      ) : countError ? (
        <ErrorState message={countError.message} />
      ) : count ? (
        <OnlineCountCard count={count} multiBox={players && !playersError ? multiBoxStats : undefined} />
      ) : null}

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">在线角色列表</h2>
        {players && !playersError && multiBoxStats.groups > 0 && (
          <button
            type="button"
            onClick={() => setOnlyMulti((v) => !v)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${
              onlyMulti
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <span className={onlyMulti ? 'text-amber-500' : 'text-muted-foreground'}>&#9679;</span>
            只看同IP多开（{multiBoxStats.players}）
          </button>
        )}
      </div>
      {playersLoading ? (
        <LoadingState />
      ) : playersError ? (
        <ErrorState message={playersError.message} />
      ) : visiblePlayers ? (
        <OnlinePlayerTable data={visiblePlayers} />
      ) : null}
    </main>
  );
}
