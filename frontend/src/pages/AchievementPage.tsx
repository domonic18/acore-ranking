import { useRecentAchievements } from '@/features/achievement/api/queries';
import { RecentAchievementTimeline } from '@/features/achievement/components/RecentAchievementTimeline';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function AchievementPage() {
  const { data, isLoading, error } = useRecentAchievements();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-6 text-2xl font-bold">最近成就</h1>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : data ? (
        <RecentAchievementTimeline data={data} />
      ) : null}
    </main>
  );
}
