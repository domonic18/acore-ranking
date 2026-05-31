import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';

interface TestData {
  id: number;
  name: string;
}

const columns: ColumnDef<TestData>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
];

const data: TestData[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

describe('DataTable', () => {
  it('renders table headers', () => {
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders table rows', () => {
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<DataTable data={[]} columns={columns} loading />);
    expect(screen.getByText('数据加载中...')).toBeInTheDocument();
  });
});
