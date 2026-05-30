import { useRecentAchievements } from '@/features/achievement/api/queries';
import { RecentAchievementTable } from '@/features/achievement/components/RecentAchievementTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function AchievementPage() {
  const { data, isLoading, error } = useRecentAchievements();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">最近成就</h1>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : data ? (
        <RecentAchievementTable data={data} />
      ) : null}
    </main>
  );
}
