import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useEmbedAvailableHeight } from '@/shared/hooks/useEmbedAvailableHeight';

/**
 * iframe 可用高度协议(shared/constants/embed):
 * 父页把 iframe 框高下发给子页,子页据此裁剪内容(首页「最近成就」嵌入)。
 */

const PARENT_POST_TARGET = '*';

let postMessage: ReturnType<typeof vi.fn>;
let originalParent: PropertyDescriptor | undefined;
let originalInnerHeight: PropertyDescriptor | undefined;

function setInnerHeight(value: number) {
  Object.defineProperty(window, 'innerHeight', { value, configurable: true, writable: true });
}

beforeEach(() => {
  postMessage = vi.fn();

  originalParent = Object.getOwnPropertyDescriptor(window, 'parent');
  Object.defineProperty(window, 'parent', {
    value: { postMessage },
    configurable: true,
    writable: true,
  });

  originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');
  setInnerHeight(800);
});

afterEach(() => {
  if (originalParent) Object.defineProperty(window, 'parent', originalParent);
  if (originalInnerHeight) {
    Object.defineProperty(window, 'innerHeight', originalInnerHeight);
  }
});

describe('useEmbedAvailableHeight', () => {
  it('顶层打开时不发消息(非嵌入)', () => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true, writable: true });

    const { result } = renderHook(() => useEmbedAvailableHeight());

    expect(result.current.isEmbedded).toBe(false);
    expect(result.current.availableHeight).toBeNull();
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('被嵌入时挂载即索要一次可用高度', () => {
    renderHook(() => useEmbedAvailableHeight());

    expect(postMessage).toHaveBeenCalledWith(
      { source: 'acore-ranking', type: 'available-height-request' },
      PARENT_POST_TARGET,
    );
  });

  it('收到父页下发的可用高度后采用该值', () => {
    const { result } = renderHook(() => useEmbedAvailableHeight());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-available', height: 612 },
          source: window.parent,
        }),
      );
    });

    expect(result.current.availableHeight).toBe(612);
    expect(result.current.effectiveHeight).toBe(612);
  });

  it('非父页来源/非本协议/非法高度的消息一律忽略', () => {
    const { result } = renderHook(() => useEmbedAvailableHeight());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-available', height: 612 },
          source: null,
        }),
      );
    });
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'someone-else', type: 'height-available', height: 612 },
          source: window.parent,
        }),
      );
    });
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'other', height: 612 },
          source: window.parent,
        }),
      );
    });
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-available', height: 0 },
          source: window.parent,
        }),
      );
    });

    expect(result.current.availableHeight).toBeNull();
  });

  it('父页未下发时退到 iframe 视口高(旧父页兜底)', () => {
    const { result } = renderHook(() => useEmbedAvailableHeight());

    expect(result.current.availableHeight).toBeNull();
    expect(result.current.effectiveHeight).toBe(800);
  });

  it('父页下发值优先于视口高', () => {
    const { result } = renderHook(() => useEmbedAvailableHeight());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-available', height: 400 },
          source: window.parent,
        }),
      );
    });

    expect(result.current.effectiveHeight).toBe(400);
  });

  it('卸载后不再接收父页消息', () => {
    const { result, unmount } = renderHook(() => useEmbedAvailableHeight());
    unmount();

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-available', height: 612 },
          source: window.parent,
        }),
      );
    });

    expect(result.current.availableHeight).toBeNull();
  });

  it('父页未回时定时重试索要(父页监听器晚于子页挂载)', () => {
    vi.useFakeTimers();
    try {
      renderHook(() => useEmbedAvailableHeight());
      expect(postMessage).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(postMessage).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(postMessage).toHaveBeenCalledTimes(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it('收到高度后停止重试', () => {
    vi.useFakeTimers();
    try {
      const { result } = renderHook(() => useEmbedAvailableHeight());

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { source: 'acore-portal', type: 'height-available', height: 612 },
            source: window.parent,
          }),
        );
      });
      expect(result.current.availableHeight).toBe(612);
      const callsAfterReceipt = postMessage.mock.calls.length;

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(postMessage).toHaveBeenCalledTimes(callsAfterReceipt);
    } finally {
      vi.useRealTimers();
    }
  });

  it('重试有上限:父页始终不回则停止索要(靠 iframe 视口高兜底)', () => {
    vi.useFakeTimers();
    try {
      renderHook(() => useEmbedAvailableHeight());
      act(() => {
        vi.advanceTimersByTime(500 * 30);
      });
      // 首次 + 20 次重试后停
      expect(postMessage).toHaveBeenCalledTimes(21);
    } finally {
      vi.useRealTimers();
    }
  });
});
