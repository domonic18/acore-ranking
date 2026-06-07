import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RaceIcon, ClassIcon } from '@/shared/components/RaceClassIcons';
import { ICON_BASE_URL, ICON_FALLBACK_URL, AOWOW_BASE_URL } from '@/shared/constants/external';
import { QUALITY_COLORS } from '@/shared/constants/game';
import type { ColumnDef } from '@tanstack/react-table';
import type { LegendaryRankPlayer } from '../types';

const LEGENDARY_COLOR = QUALITY_COLORS[5];

function LegendaryItemIcon({ item }: { item: { name: string; display_id: number; item_entry: number; icon: string | null } }) {
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
        style={{ borderColor: LEGENDARY_COLOR }}
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
      <span className="max-w-[120px] truncate text-xs" style={{ color: LEGENDARY_COLOR }}>
        {item.name}
      </span>
    </a>
  );
}

const columns: ColumnDef<LegendaryRankPlayer>[] = [
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
    meta: { className: 'hidden md:table-cell' },
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
    meta: { className: 'hidden md:table-cell' },
    cell: ({ row }) => <FactionBadge side={row.original.side} />,
  },
  { accessorKey: 'legendary_count', header: '传说装备数' },
  {
    accessorKey: 'legendary_items',
    header: '装备',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.legendary_items.map((item, i) => (
          <LegendaryItemIcon key={`${item.item_entry}-${i}`} item={item} />
        ))}
      </div>
    ),
  },
];

interface LegendaryRankingTableProps {
  data: LegendaryRankPlayer[];
}

export function LegendaryRankingTable({ data }: LegendaryRankingTableProps) {
  return <DataTable data={data} columns={columns} />;
}
