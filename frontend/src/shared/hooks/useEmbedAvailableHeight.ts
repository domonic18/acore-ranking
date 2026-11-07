import { useCallback, useEffect, useState } from 'react';
import {
  EMBED_AVAILABLE_HEIGHT_REQUEST_TYPE,
  EMBED_AVAILABLE_HEIGHT_TYPE,
  EMBED_HEIGHT_REQUEST_SOURCE,
  EMBED_HEIGHT_SOURCE,
} from '@/shared/constants/embed';

export interface EmbedAvailableHeightState {
  /** 父页下发的可用高度(px);未收到时为 null */
  availableHeight: number | null;
  /** 实际可用高度:优先父页下发值,否则取 iframe 视口高(旧父页兜底);非嵌入时为 null */
  effectiveHeight: number | null;
  /** 是否运行在 iframe 内(顶层打开为 false) */
  isEmbedded: boolean;
  /** 向父页索要可用高度(握手补要) */
  requestAvailableHeight: () => void;
}

/**
 * iframe 嵌入模式下的「可用高度」获取(协议见 shared/constants/embed)。
 *
 * - 顶层打开时 window.parent === window,直接不做事(无副作用);
 * - 父页把 iframe 的框高下发过来(父页需要给 iframe 留出自己那一部分时,
 *   下发的值可以小于 iframe 视口高,子页按它裁剪);
 * - 父页未下发时退到 iframe 视口高(window.innerHeight)——iframe 视口高就是父页给的框高,
 *   对未实现本协议的旧父页同样正确;
 * - 挂载后主动索要一次,补上「父页监听器晚于本页挂载」的竞态。
 */
export function useEmbedAvailableHeight(): EmbedAvailableHeightState {
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const isEmbedded = typeof window !== 'undefined' && window.parent !== window;

  const requestAvailableHeight = useCallback(() => {
    if (!isEmbedded) return;
    window.parent.postMessage(
      { source: EMBED_HEIGHT_SOURCE, type: EMBED_AVAILABLE_HEIGHT_REQUEST_TYPE },
      '*',
    );
  }, [isEmbedded]);

  useEffect(() => {
    if (!isEmbedded) return;

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const data = event.data as { source?: unknown; type?: unknown; height?: unknown } | null;
      if (data?.source !== EMBED_HEIGHT_REQUEST_SOURCE) return;
      if (data.type !== EMBED_AVAILABLE_HEIGHT_TYPE) return;
      if (typeof data.height !== 'number' || !Number.isFinite(data.height) || data.height <= 0) {
        return;
      }
      setAvailableHeight(Math.round(data.height));
    };

    const onResize = () => setViewportHeight(window.innerHeight);

    window.addEventListener('message', onMessage);
    window.addEventListener('resize', onResize);
    onResize();
    requestAvailableHeight();

    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('resize', onResize);
    };
  }, [isEmbedded, requestAvailableHeight]);

  return {
    availableHeight,
    effectiveHeight: availableHeight ?? viewportHeight,
    isEmbedded,
    requestAvailableHeight,
  };
}
