import { useFirstKills } from '@/features/encounter/api/queries';
import { FirstKillsTable } from '@/features/encounter/components/FirstKillsTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function EncounterPage() {
  const { data, isLoading, error } = useFirstKills();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
        <h1 className="mb-4 text-2xl font-bold">纳克萨玛斯首杀记录</h1>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} />
        ) : data ? (
          <FirstKillsTable data={data} />
        ) : null}
      </main>
    </div>
  );
}
