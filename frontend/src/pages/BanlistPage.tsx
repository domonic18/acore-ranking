import { useBanlist } from '@/features/banlist/api/queries';
import { DataTable } from '@/shared/components/DataTable';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import type { ColumnDef } from '@tanstack/react-table';
import type { BanRecord } from '@/features/banlist/types';

const columns: ColumnDef<BanRecord>[] = [
  { accessorKey: 'username', header: '账号' },
  { accessorKey: 'last_ip', header: '最后 IP' },
  { accessorKey: 'banreason', header: '封禁原因' },
  { accessorKey: 'bandate', header: '封禁时间' },
  { accessorKey: 'unbandate', header: '解封时间' },
];

export default function BanlistPage() {
  const { data, isLoading, error } = useBanlist();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">封禁列表</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : data ? (
        <DataTable data={data} columns={columns} />
      ) : null}
    </main>
  );
}
