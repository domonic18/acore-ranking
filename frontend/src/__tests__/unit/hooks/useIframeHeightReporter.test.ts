import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIframeHeightReporter } from '@/shared/hooks/useIframeHeightReporter';

/**
 * iframe 内容高度上报协议(shared/constants/embed):
 * 子页被门户 iframe 嵌入时把**内容真实高度**报给父页,父页据此撑高/收高 iframe。
 *
 * 口径要点:量内容锚点在文档坐标下的底边(与视口高无关,可增可减),
 * 不用 scrollHeight(恒 ≥ 视口高,会被当前框高托底 → 父页只涨不跌)。
 */

const PARENT_POST_TARGET = '*';
const SETTLE_MS = 200;

let postMessage: ReturnType<typeof vi.fn>;
let resizeCallback: ((entries: unknown[], observer: unknown) => void) | null;
let originalParent: PropertyDescriptor | undefined;
let anchor: HTMLElement | null = null;
let anchorHeight = 0;
let queryClient: QueryClient;

function createAnchor(): HTMLElement {
  const element = document.createElement('div');
  element.setAttribute('data-embed-content', '');
  element.getBoundingClientRect = () =>
    ({ bottom: anchorHeight, top: 0, height: anchorHeight, width: 0, left: 0, right: 0 }) as DOMRect;
  document.body.appendChild(element);
  return element;
}

function wrapper({ children }: { children: ReactNode }) {
  return createElement(QueryClientProvider, { client: queryClient }, children);
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  postMessage = vi.fn();
  resizeCallback = null;
  anchor = null;
  anchorHeight = 0;

  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  originalParent = Object.getOwnPropertyDescriptor(window, 'parent');
  Object.defineProperty(window, 'parent', {
    value: { postMessage },
    configurable: true,
    writable: true,
  });

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
  vi.useRealTimers();
  vi.unstubAllGlobals();
  if (originalParent) Object.defineProperty(window, 'parent', originalParent);
  anchor?.remove();
  anchor = null;
});

describe('useIframeHeightReporter', () => {
  it('顶层打开时不上报(window.parent === window)', () => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true, writable: true });
    anchor = createAnchor();
    anchorHeight = 600;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('被 iframe 嵌入时静默期后上报内容高度', () => {
    anchor = createAnchor();
    anchorHeight = 1234;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      { source: 'acore-ranking', type: 'height', height: 1234 },
      PARENT_POST_TARGET,
    );
  });

  it('内容变矮时上报更小的高度(可增可减,不只涨不跌)', () => {
    anchor = createAnchor();
    anchorHeight = 2794;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);
    expect(postMessage).toHaveBeenLastCalledWith(
      { source: 'acore-ranking', type: 'height', height: 2794 },
      PARENT_POST_TARGET,
    );

    anchorHeight = 600;
    act(() => {
      resizeCallback?.([], undefined);
    });
    advance(SETTLE_MS);

    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(postMessage).toHaveBeenLastCalledWith(
      { source: 'acore-ranking', type: 'height', height: 600 },
      PARENT_POST_TARGET,
    );
  });

  it('内容高度不变时去重,不重复上报', () => {
    anchor = createAnchor();
    anchorHeight = 800;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);
    expect(postMessage).toHaveBeenCalledTimes(1);

    act(() => {
      resizeCallback?.([], undefined);
    });
    advance(SETTLE_MS);

    expect(postMessage).toHaveBeenCalledTimes(1);
  });

  it('无内容锚点时不上报(不得回退 scrollHeight)', () => {
    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('量到的高度低于下限时不上报', () => {
    anchor = createAnchor();
    anchorHeight = 20;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('数据在途时不上报,落定后补报', async () => {
    let resolvePending: ((value: string) => void) | null = null;
    void queryClient.fetchQuery({
      queryKey: ['pending'],
      queryFn: () =>
        new Promise<string>((resolve) => {
          resolvePending = resolve;
        }),
    });
    anchor = createAnchor();
    anchorHeight = 640;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS * 3);
    expect(postMessage).not.toHaveBeenCalled();

    await act(async () => {
      resolvePending?.('ok');
      await Promise.resolve();
    });
    advance(SETTLE_MS);

    expect(postMessage).toHaveBeenCalledWith(
      { source: 'acore-ranking', type: 'height', height: 640 },
      PARENT_POST_TARGET,
    );
  });

  it('父页索要高度时补报一次', () => {
    anchor = createAnchor();
    anchorHeight = 500;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);
    postMessage.mockClear();

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-request' },
          source: window.parent,
        }),
      );
    });
    advance(SETTLE_MS);

    expect(postMessage).toHaveBeenCalledTimes(1);
  });

  it('非父页来源或非本协议的消息不触发补报', () => {
    anchor = createAnchor();
    anchorHeight = 500;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);
    postMessage.mockClear();

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'height-request' },
          source: null,
        }),
      );
    });
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'someone-else', type: 'height-request' },
          source: window.parent,
        }),
      );
    });
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { source: 'acore-portal', type: 'other' },
          source: window.parent,
        }),
      );
    });
    advance(SETTLE_MS);

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('卸载后不再上报', () => {
    anchor = createAnchor();
    anchorHeight = 500;

    const { unmount } = renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);
    unmount();
    postMessage.mockClear();

    anchorHeight = 900;
    act(() => {
      resizeCallback?.([], undefined);
    });
    advance(SETTLE_MS);

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('上报目标为父页(嵌入时 postMessage 的接收方是 window.parent)', () => {
    anchor = createAnchor();
    anchorHeight = 700;

    renderHook(() => useIframeHeightReporter(), { wrapper });
    advance(SETTLE_MS);

    expect(postMessage).toHaveBeenCalledWith(expect.any(Object), PARENT_POST_TARGET);
  });
});
