import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RaceIcon, ClassIcon } from '@/shared/components/RaceClassIcons';
import { Badge } from '@/shared/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import type { OnlinePlayer } from '../types';
import { countByIp, isMultiBox } from '../utils/multiBox';

interface OnlinePlayerTableProps {
  data: OnlinePlayer[];
}

export function OnlinePlayerTable({ data }: OnlinePlayerTableProps) {
  const ipCounts = useMemo(() => countByIp(data), [data]);

  const columns: ColumnDef<OnlinePlayer>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: '角色名',
      cell: ({ row }) => (
        <Link
          to={`/character/${encodeURIComponent(row.original.name)}`}
          className="text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'race',
      header: '种族',
      cell: ({ row }) => (
        <RaceIcon race={row.original.race} gender={row.original.gender} size={24} />
      ),
    },
    {
      accessorKey: 'class',
      header: '职业',
      cell: ({ row }) => (
        <ClassIcon class={row.original.class} size={24} />
      ),
    },
    { accessorKey: 'level', header: '等级' },
    {
      accessorKey: 'side',
      header: '阵营',
      cell: ({ row }) => <FactionBadge side={row.original.side} />,
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: () => (
        <span className="whitespace-nowrap text-sm">
          <span className="text-green-500">&#9679;</span> 在线
        </span>
      ),
    },
    {
      accessorKey: 'ip',
      header: '登录IP',
      cell: ({ row }) => {
        const ip = row.original.ip;
        if (!ip) return <span className="text-muted-foreground">-</span>;
        const count = ipCounts.get(ip) || 1;
        return (
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono text-xs">{ip}</span>
            {count >= 2 && (
              <Badge
                variant="outline"
                className="whitespace-nowrap border-amber-500/40 bg-amber-500/10 px-1.5 py-0 text-xs text-amber-600 dark:text-amber-400"
              >
                多开 ×{count}
              </Badge>
            )}
          </span>
        );
      },
    },
  ], [ipCounts]);

  return (
    <DataTable
      data={data}
      columns={columns}
      rowClassName={(row) => (isMultiBox(row, ipCounts) ? 'bg-amber-500/10' : '')}
      refreshHint="在线数据每60秒刷新一次"
    />
  );
}
