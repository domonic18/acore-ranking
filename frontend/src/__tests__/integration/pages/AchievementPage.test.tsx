import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import type { RecentAchievement } from '@/features/achievement/types';

/**
 * 成就页的嵌入(peek)模式:
 * 被门户 iframe 嵌入时,内容裁剪到父页给的框高,超出部分渐隐示意;
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

type ObserverCallback = (entries: ResizeObserverEntry[]) => void;

let observerCallbacks: ObserverCallback[] = [];
/** 读布局的次数:el.scrollHeight / getBoundingClientRect 等 */
let layoutReads = 0;

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
  observerCallbacks = [];
  layoutReads = 0;
  // 读 scrollHeight 即「读布局」:此刻 DOM 若脏,浏览器被迫同步重排(Chrome Forced reflow 违规)
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      layoutReads += 1;
      return 0;
    },
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ObserverCallback) {
        observerCallbacks.push(callback);
      }
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

/** 模拟浏览器把新尺寸投递给 ResizeObserver */
function emitResize(height: number) {
  act(() => {
    const entry = {
      borderBoxSize: [{ blockSize: height, inlineSize: 800 }],
      contentRect: { height, width: 800 },
    } as unknown as ResizeObserverEntry;
    for (const callback of observerCallbacks) callback([entry]);
  });
}

describe('AchievementPage 嵌入模式', () => {
  it('内容超出可用高度时裁剪到框高,不给出新窗口出口', () => {
    const { container } = render(<AchievementPage />);
    emitResize(2000);

    const root = container.firstElementChild as HTMLElement;
    expect(root.style.height).toBe('600px');
    expect(root.className).toContain('overflow-hidden');
    expect(screen.getByTestId('achievement-fade')).toBeInTheDocument();
    // 出口由门户页头的「新窗口打开」承担,子页不再叠浮层按钮压住内容
    expect(screen.queryByTestId('achievement-view-all')).not.toBeInTheDocument();
  });

  it('内容未超出可用高度时不显示渐隐', () => {
    const { container } = render(<AchievementPage />);
    emitResize(300);

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('overflow-hidden');
    expect(screen.queryByTestId('achievement-fade')).not.toBeInTheDocument();
  });

  it('顶层打开(非嵌入)时保持原样:无裁剪', () => {
    mockEmbedState.isEmbedded = false;
    mockEmbedState.effectiveHeight = null;

    const { container } = render(<AchievementPage />);
    emitResize(2000);

    const root = container.firstElementChild as HTMLElement;
    // 顶层不裁剪;视口地板在 body 上,内容容器不再自带 min-h-screen
    expect(root.className).not.toContain('min-h-screen');
    expect(root.style.height).toBe('');
  });

  it('高度只取自 ResizeObserver 自报尺寸,不读布局(避免强制重排)', () => {
    render(<AchievementPage />);
    emitResize(2000);

    // 读 scrollHeight 会让浏览器在 DOM 脏时同步重排 → Chrome Forced reflow 违规
    expect(layoutReads).toBe(0);
  });
});
