import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { GoldDisplay } from '@/shared/components/GoldDisplay';
import { ICON_BASE_URL, ICON_FALLBACK_URL, AOWOW_BASE_URL } from '@/shared/constants/external';
import { QUALITY_COLORS } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';
import type { AuctionItem } from '../types';

function ItemCell({ item }: { item: AuctionItem }) {
  const iconUrl = item.icon ? `${ICON_BASE_URL}/${item.icon.toLowerCase()}.jpg` : null;
  const aowowUrl = `${AOWOW_BASE_URL}?item=${item.item_entry}`;
  const qualityColor = QUALITY_COLORS[item.quality] || '#9d9d9d';

  return (
    <a
      href={aowowUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:opacity-80"
      title={item.item_name}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded border"
        style={{ borderColor: qualityColor }}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={item.item_name}
            className="h-7 w-7 rounded"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (item.icon && !target.src.includes(ICON_FALLBACK_URL)) {
                target.src = `${ICON_FALLBACK_URL}/${item.icon.toLowerCase()}.jpg`;
              } else {
                target.style.display = 'none';
              }
            }}
          />
        ) : (
          <span className="text-[8px] text-muted-foreground">?</span>
        )}
      </div>
      <span className="truncate font-medium" style={{ color: qualityColor }}>
        {item.item_name}
      </span>
    </a>
  );
}

function formatExpireTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = timestamp - now;
  if (diff <= 0) return '已过期';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}天 ${hours}小时`;
  if (hours > 0) return `${hours}小时 ${minutes}分钟`;
  return `${minutes}分钟`;
}

const columns: ColumnDef<AuctionItem>[] = [
  {
    accessorKey: 'item_name',
    header: '物品',
    cell: ({ row }) => <ItemCell item={row.original} />,
  },
  {
    accessorKey: 'owner_name',
    header: '卖家',
    cell: ({ row }) => (
      <Link
        to={`/character/${encodeURIComponent(row.original.owner_name)}`}
        className="text-primary hover:underline"
      >
        {row.original.owner_name}
      </Link>
    ),
  },
  {
    accessorKey: 'start_bid',
    header: '起拍价',
    cell: ({ row }) => <GoldDisplay copper={row.original.start_bid} />,
  },
  {
    accessorKey: 'last_bid',
    header: '当前出价',
    cell: ({ row }) =>
      row.original.last_bid > 0 ? (
        <GoldDisplay copper={row.original.last_bid} />
      ) : (
        <span className="text-muted-foreground">无</span>
      ),
  },
  {
    accessorKey: 'buyout_price',
    header: '一口价',
    cell: ({ row }) =>
      row.original.buyout_price > 0 ? (
        <GoldDisplay copper={row.original.buyout_price} />
      ) : (
        <span className="text-muted-foreground">无</span>
      ),
  },
  {
    accessorKey: 'expire_time',
    header: '剩余时间',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatExpireTime(row.original.expire_time)}
      </span>
    ),
  },
];

interface AuctionTableProps {
  data: AuctionItem[];
}

export function AuctionTable({ data }: AuctionTableProps) {
  return <DataTable data={data} columns={columns} />;
}
