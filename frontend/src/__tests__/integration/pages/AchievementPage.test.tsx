import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RecentAchievement } from '@/features/achievement/types';

/**
 * 成就页的嵌入(peek)模式:
 * 被门户 iframe 嵌入时,内容裁剪到父页给的框高,超出部分渐隐并给出「查看全部」出口;
 * 顶层打开时行为与嵌入前完全一致。
 */

const mockEmbedState = {
  availableHeight: 600 as number | null,
  effectiveHeight: 600 as number | null,
  isEmbedded: true,
  requestAvailableHeight: () => {},
};

const mockQuery = {
  data: [] as RecentAchievement[] | undefined,
  isLoading: false,
  error: null as { message: string } | null,
};

vi.mock('@/shared/components/EmbedProvider', () => ({
  useEmbed: () => mockEmbedState,
}));

vi.mock('@/features/achievement/api/queries', () => ({
  useRecentAchievements: () => mockQuery,
}));

import AchievementPage from '@/pages/AchievementPage';

let scrollHeight = 0;

const SAMPLE: RecentAchievement = {
  guid: 1,
  name: '测试角色',
  race: 1,
  class: 1,
  gender: 0,
  level: 60,
  achievement_description: '测试成就',
  achievement_date: 1_700_000_000,
};

beforeEach(() => {
  scrollHeight = 0;
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return scrollHeight;
    },
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  mockEmbedState.availableHeight = 600;
  mockEmbedState.effectiveHeight = 600;
  mockEmbedState.isEmbedded = true;
  mockQuery.data = [SAMPLE];
  mockQuery.isLoading = false;
  mockQuery.error = null;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AchievementPage 嵌入模式', () => {
  it('内容超出可用高度时裁剪并给出「查看全部」出口', () => {
    scrollHeight = 2000;

    const { container } = render(<AchievementPage />);

    const root = container.firstElementChild as HTMLElement;
    expect(root.style.height).toBe('600px');
    expect(root.className).toContain('overflow-hidden');
    expect(screen.getByTestId('achievement-view-all')).toBeInTheDocument();
  });

  it('内容未超出可用高度时不显示渐隐与出口', () => {
    scrollHeight = 300;

    const { container } = render(<AchievementPage />);

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('overflow-hidden');
    expect(screen.queryByTestId('achievement-view-all')).not.toBeInTheDocument();
  });

  it('顶层打开(非嵌入)时保持原样:无裁剪、无出口', () => {
    mockEmbedState.isEmbedded = false;
    mockEmbedState.effectiveHeight = null;
    scrollHeight = 2000;

    const { container } = render(<AchievementPage />);

    const root = container.firstElementChild as HTMLElement;
    // 顶层不裁剪;视口地板在 body 上,内容容器不再自带 min-h-screen
    expect(root.className).not.toContain('min-h-screen');
    expect(root.style.height).toBe('');
    expect(screen.queryByTestId('achievement-view-all')).not.toBeInTheDocument();
  });
});
