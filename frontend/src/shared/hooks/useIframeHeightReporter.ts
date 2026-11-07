import { useEffect } from 'react';
import {
  EMBED_HEIGHT_REQUEST_SOURCE,
  EMBED_HEIGHT_REQUEST_TYPE,
  EMBED_HEIGHT_SOURCE,
  EMBED_HEIGHT_TYPE,
} from '@/shared/constants/embed';

/**
 * iframe 嵌入模式下的内容高度上报(协议见 shared/constants/embed)。
 *
 * - 仅在被 iframe 嵌入时生效(顶层打开时 window.parent === window,直接不做事);
 * - 用 ResizeObserver 盯 document.body:表格分页/异步加载/Tab 切换都会改变 body 高度,
 *   高度一变就上报,父页据此把 iframe 撑到内容高度;
 * - 上报值天然只增不减:根容器 min-h-screen 撑满视口,scrollHeight 恒 ≥ 当前 iframe 视口高,
 *   所以内容变短时 iframe 保持原高度(多出的空白由本页自身背景填满,不会露出父页底色);
 * - 父页监听器可能晚于本页挂载就绪,故父页会回一条 height-request,本页收到后补报一次。
 */
export function useIframeHeightReporter(): void {
  useEffect(() => {
    if (window.parent === window) return;

    const report = () => {
      const height = Math.ceil(
        Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      );
      window.parent.postMessage(
        { source: EMBED_HEIGHT_SOURCE, type: EMBED_HEIGHT_TYPE, height },
        '*',
      );
    };

    const onRequest = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const data = event.data as { source?: unknown; type?: unknown } | null;
      if (data?.source !== EMBED_HEIGHT_REQUEST_SOURCE) return;
      if (data.type !== EMBED_HEIGHT_REQUEST_TYPE) return;
      report();
    };

    const observer = new ResizeObserver(report);
    observer.observe(document.body);
    window.addEventListener('resize', report);
    window.addEventListener('message', onRequest);
    report();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', report);
      window.removeEventListener('message', onRequest);
    };
  }, []);
}
