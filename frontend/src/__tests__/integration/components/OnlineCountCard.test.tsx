import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OnlineCountCard } from '@/features/online/components/OnlineCountCard';
import type { OnlineCount } from '@/features/online/types';

describe('OnlineCountCard', () => {
  it('renders count data', () => {
    const count: OnlineCount = {
      total_count: 100,
      alliance_count: 45,
      horde_count: 55,
    };

    render(<OnlineCountCard count={count} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('在线总数')).toBeInTheDocument();
    expect(screen.getByText('联盟')).toBeInTheDocument();
    expect(screen.getByText('部落')).toBeInTheDocument();
  });
});
