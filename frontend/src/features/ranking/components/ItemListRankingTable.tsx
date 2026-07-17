import { ICON_BASE_URL, ICON_FALLBACK_URL, AOWOW_BASE_URL } from '@/shared/constants/external';
import { BaseRankingTable } from './BaseRankingTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { RankPlayer, RankedItem } from '../types';

interface ItemIconProps {
  item: RankedItem;
  color: string;
}

function ItemIcon({ item, color }: ItemIconProps) {
  const iconUrl = item.icon ? `${ICON_BASE_URL}/${item.icon.toLowerCase()}.jpg` : null;
  const aowowUrl = `${AOWOW_BASE_URL}?item=${item.item_entry}`;

  return (
    <a
      href={aowowUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded px-1.5 py-1 hover:bg-secondary/60"
      title={item.name}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded border"
        style={{ borderColor: color }}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={item.name}
            className="h-6 w-6 rounded"
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
      <span className="max-w-[120px] truncate text-xs" style={{ color }}>
        {item.name}
      </span>
    </a>
  );
}

export interface ItemListRankingTableProps<
  T extends RankPlayer,
  CountKey extends keyof T & string,
  ItemsKey extends keyof T & string,
> {
  data: T[];
  countKey: CountKey;
  countHeader: string;
  itemsKey: ItemsKey;
  itemsHeader: string;
  itemColor: string;
}

export function ItemListRankingTable<
  T extends RankPlayer,
  CountKey extends keyof T & string,
  ItemsKey extends keyof T & string,
>({
  data,
  countKey,
  countHeader,
  itemsKey,
  itemsHeader,
  itemColor,
}: ItemListRankingTableProps<T, CountKey, ItemsKey>) {
  const extraColumns: ColumnDef<T>[] = [
    { accessorKey: countKey, header: countHeader },
    {
      accessorKey: itemsKey,
      header: itemsHeader,
      cell: ({ row }) => {
        const items = row.original[itemsKey] as unknown as RankedItem[];
        return (
          <div className="flex flex-wrap gap-1">
            {items.map((item, i) => (
              <ItemIcon key={`${item.item_entry}-${i}`} item={item} color={itemColor} />
            ))}
          </div>
        );
      },
    },
  ];

  return <BaseRankingTable data={data} extraColumns={extraColumns} />;
}
