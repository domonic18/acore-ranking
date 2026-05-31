import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FactionBadge } from '@/shared/components/FactionBadge';

describe('FactionBadge', () => {
  it('renders alliance badge', () => {
    render(<FactionBadge side={0} />);
    expect(screen.getByText('联盟')).toBeInTheDocument();
  });

  it('renders horde badge', () => {
    render(<FactionBadge side={1} />);
    expect(screen.getByText('部落')).toBeInTheDocument();
  });
});
