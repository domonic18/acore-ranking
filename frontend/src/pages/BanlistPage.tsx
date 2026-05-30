import { useBanlist } from '@/features/banlist/api/queries';
import { BanlistTable } from '@/features/banlist/components/BanlistTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function BanlistPage() {
  const { data, isLoading, error } = useBanlist();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">封禁列表</h1>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : data ? (
        <BanlistTable data={data} />
      ) : null}
    </main>
  );
}
