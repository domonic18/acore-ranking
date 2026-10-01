import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { BanRecord } from '../types';
import { BanlistDetailDialog } from './BanlistDetailDialog';

const BanTypeCell = ({ value }: { value: string }) => {
  const isAccount = value === 'account';
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${
        isAccount
          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
          : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
      }`}
    >
      {isAccount ? '账号' : '角色'}
    </span>
  );
};

const CharacterNamesCell = ({ value }: { value: string }) => {
  if (!value) return <span className="text-muted-foreground text-xs">—</span>;
  const names = value.split(',').filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
      {names.map((name) => (
        <Link
          key={name}
          to={`/character/${encodeURIComponent(name)}`}
          className="inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50"
        >
          {name}
        </Link>
      ))}
    </div>
  );
};

const UsernameCell = ({ value }: { value: string }) => (
  <div className="group relative inline-flex max-w-[180px] items-center gap-2">
    <span className="truncate font-semibold text-foreground" title={value}>
      {value}
    </span>
    <a
      href={import.meta.env.VITE_APPEAL_URL || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 opacity-0 transition-opacity hover:bg-amber-200 group-hover:opacity-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
      onClick={(e) => e.stopPropagation()}
    >
      申诉
    </a>
  </div>
);

// CSS 截断防溢出（此前 JS 截断 35 字符仍会撑破布局），完整内容行点击后详情查看
const BanReasonCell = ({ value }: { value: string }) => {
  const text = String(value ?? '');
  return (
    <span className="block max-w-[260px] truncate" title={text}>
      {text || <span className="text-muted-foreground">—</span>}
    </span>
  );
};

const UnbanDateCell = ({ row }: { row: BanRecord }) => {
  if (row.bandate === row.unbandate) {
    return <span className="text-red-500 font-medium">永久</span>;
  }
  return <span className="whitespace-nowrap">{row.unbandate}</span>;
};

const columns: ColumnDef<BanRecord>[] = [
  {
    accessorKey: 'banType',
    header: '类型',
    cell: (info) => <BanTypeCell value={String(info.getValue() || 'account')} />,
    meta: { className: 'min-w-[70px]' },
  },
  {
    accessorKey: 'character_names',
    header: '角色名',
    cell: (info) => <CharacterNamesCell value={String(info.getValue() || '')} />,
    meta: { className: 'min-w-[140px]' },
  },
  {
    accessorKey: 'username',
    header: '所属账号',
    cell: (info) => <UsernameCell value={String(info.getValue() || '')} />,
    meta: { className: 'min-w-[120px]' },
  },
  {
    accessorKey: 'last_ip',
    header: '最后 IP',
    meta: { className: 'min-w-[110px]' },
  },
  {
    accessorKey: 'banreason',
    header: '封禁原因',
    cell: (info) => <BanReasonCell value={String(info.getValue() || '')} />,
    meta: { className: 'min-w-[180px] max-w-[280px]' },
  },
  {
    accessorKey: 'bandate',
    header: '封禁时间',
    meta: { className: 'min-w-[150px] whitespace-nowrap' },
  },
  {
    accessorKey: 'unbandate',
    header: '解封时间',
    cell: (info) => <UnbanDateCell row={info.row.original} />,
    meta: { className: 'min-w-[150px] whitespace-nowrap' },
  },
];

interface BanlistTableProps {
  data: BanRecord[];
}

export function BanlistTable({ data }: BanlistTableProps) {
  const [selected, setSelected] = useState<BanRecord | null>(null);

  // 行内链接（角色名/申诉）保持自身行为，不触发行点击
  const handleRowClick = (row: BanRecord, event: React.MouseEvent<HTMLTableRowElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    setSelected(row);
  };

  return (
    <div className="space-y-1.5">
      <DataTable data={data} columns={columns} onRowClick={handleRowClick} />
      <div className="text-center text-xs text-muted-foreground">点击任意行可查看封禁详情（原因支持 Markdown 渲染）</div>
      <BanlistDetailDialog record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
