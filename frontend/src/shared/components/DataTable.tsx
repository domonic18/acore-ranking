import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
}

const pageSizeOptions = [10, 25, 50, 100];

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(0);

  if (current <= 3) {
    // Near start: show 1 2 3 4 5 ... last
    pages.push(1, 2, 3, 4);
    pages.push('ellipsis');
    pages.push(total - 1);
  } else if (current >= total - 4) {
    // Near end: show first ... total-4 total-3 total-2 total-1
    pages.push('ellipsis');
    pages.push(total - 5, total - 4, total - 3, total - 2, total - 1);
  } else {
    // Middle: show first ... current-1 current current+1 ... last
    pages.push('ellipsis');
    pages.push(current - 1, current, current + 1);
    pages.push('ellipsis');
    pages.push(total - 1);
  }

  return pages;
}

export function DataTable<T>({ data, columns, loading }: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const currentPageRows = table.getRowModel().rows.length;

  const startItem = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = totalRows === 0 ? 0 : pageIndex * pageSize + currentPageRows;

  const pageNumbers = useMemo(() => getPageNumbers(pageIndex, pageCount), [pageIndex, pageCount]);

  return (
    <div className="space-y-3">
      {/* 顶部工具栏：每页数量左对齐，搜索右对齐 */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">每页显示</span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">条</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="搜索..."
            value={globalFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            className="h-9 w-56 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter('')}
              className="h-9 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table className="w-full min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={(header.column.columnDef.meta as { className?: string } | undefined)?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  数据加载中...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`whitespace-nowrap ${(cell.column.columnDef.meta as { className?: string } | undefined)?.className || ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 底部分页区域 */}
      <div className="flex flex-col gap-3">
        {/* 信息 + 分页按钮 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            显示第 {startItem} 至 {endItem} 项结果，共 {totalRows} 项
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
            >
              首页
            </button>
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
            >
              上页
            </button>

            {pageNumbers.map((page, idx) => {
              if (page === 'ellipsis') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
                    …
                  </span>
                );
              }
              const isActive = page === pageIndex;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => table.setPageIndex(page)}
                  className={`h-8 min-w-[2rem] rounded-md border px-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-secondary'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
            >
              下页
            </button>
            <button
              type="button"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
            >
              末页
            </button>
          </div>
        </div>

        {/* 刷新提示 */}
        <div className="text-center text-sm text-muted-foreground">
          排行榜数据每5分钟刷新一次
        </div>
      </div>
    </div>
  );
}
