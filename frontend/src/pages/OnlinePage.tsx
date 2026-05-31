import { useOnlineCount, useOnlinePlayers } from '@/features/online/api/queries';
import { OnlineCountCard } from '@/features/online/components/OnlineCountCard';
import { OnlinePlayerTable } from '@/features/online/components/OnlinePlayerTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function OnlinePage() {
  const { data: count, isLoading: countLoading, error: countError } = useOnlineCount();
  const { data: players, isLoading: playersLoading, error: playersError } = useOnlinePlayers();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">在线玩家</h1>

      {countLoading ? (
        <LoadingState />
      ) : countError ? (
        <ErrorState message={countError.message} />
      ) : count ? (
        <OnlineCountCard count={count} />
      ) : null}

      <h2 className="mb-2 text-lg font-semibold">在线角色列表</h2>
      {playersLoading ? (
        <LoadingState />
      ) : playersError ? (
        <ErrorState message={playersError.message} />
      ) : players ? (
        <OnlinePlayerTable data={players} />
      ) : null}
    </main>
  );
}
