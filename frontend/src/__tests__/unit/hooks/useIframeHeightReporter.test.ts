import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIframeHeightReporter } from '@/shared/hooks/useIframeHeightReporter';

/**
 * iframe 高度上报协议(shared/constants/embed):
 * 子页被门户 iframe 嵌入时把内容高度报给父页,父页据此撑高 iframe。
 */

const PARENT_POST_TARGET = '*';

let postMessage: ReturnType<typeof vi.fn>;
let resizeCallback: ((entries: unknown[], observer: unknown) => void) | null;
let originalParent: PropertyDescriptor | undefined;
let originalScrollHeight: PropertyDescriptor | undefined;

function setScrollHeight(value: number) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value,
    configurable: true,
  });
}

beforeEach(() => {
  postMessage = vi.fn();
  resizeCallback = null;

  originalParent = Object.getOwnPropertyDescriptor(window, 'parent');
  Object.defineProperty(window, 'parent', {
    value: { postMessage },
    configurable: true,
    writable: true,
  });

  originalScrollHeight = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollHeight');
  setScrollHeight(0);

  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: (entries: unknown[], observer: unknown) => void) {
        resizeCallback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {
        resizeCallback = null;
      }
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalParent) Object.defineProperty(window, 'parent', originalParent);
  if (originalScrollHeight) {
    Object.defineProperty(document.documentElement, 'scrollHeight', originalScrollHeight);
  }
});

describe('useIframeHeightReporter', () => {
  it('顶层打开时不上报(window.parent === window)', () => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true, writable: true });

    renderHook(() => useIframeHeightReporter());

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('被 iframe 嵌入时挂载即上报一次内容高度', () => {
    setScrollHeight(1234);

    renderHook(() => useIframeHeightReporter());

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      { source: 'acore-ranking', type: 'height', height: 1234 },
      PARENT_POST_TARGET,
    );
  });

  it('父页索要高度时补报一次', () => {
    renderHook(() => useIframeHeightReporter());
    postMessage.mockClear();

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'acore-portal', type: 'height-request' },
        source: window.parent,
      }),
    );

    expect(postMessage).toHaveBeenCalledTimes(1);
  });

  it('非父页来源或非本协议的消息不触发补报', () => {
    renderHook(() => useIframeHeightReporter());
    postMessage.mockClear();

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'acore-portal', type: 'height-request' },
        source: null,
      }),
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'someone-else', type: 'height-request' },
        source: window.parent,
      }),
    );
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'acore-portal', type: 'other' },
        source: window.parent,
      }),
    );

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('内容高度变化(ResizeObserver)时重新上报', () => {
    renderHook(() => useIframeHeightReporter());
    postMessage.mockClear();
    setScrollHeight(2000);

    resizeCallback?.([], undefined);

    expect(postMessage).toHaveBeenCalledWith(
      { source: 'acore-ranking', type: 'height', height: 2000 },
      PARENT_POST_TARGET,
    );
  });

  it('卸载后不再上报', () => {
    const { unmount } = renderHook(() => useIframeHeightReporter());
    unmount();
    postMessage.mockClear();

    setScrollHeight(3000);
    resizeCallback?.([], undefined);
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'acore-portal', type: 'height-request' },
        source: window.parent,
      }),
    );

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('上报目标为父页(嵌入时 postMessage 的接收方是 window.parent)', () => {
    renderHook(() => useIframeHeightReporter());

    expect(postMessage).toHaveBeenCalledWith(expect.any(Object), PARENT_POST_TARGET);
  });
});
