import { useAuctionList } from '@/features/auction/api/queries';
import { AuctionTable } from '@/features/auction/components/AuctionTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function AuctionPage() {
  const { data, isLoading, error } = useAuctionList();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">拍卖行</h1>
        <span className="text-sm text-muted-foreground">
          数据每 1 分钟刷新一次
        </span>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : data ? (
        <AuctionTable data={data} />
      ) : null}
    </main>
  );
}
