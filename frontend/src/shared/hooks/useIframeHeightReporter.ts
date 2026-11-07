import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  EMBED_HEIGHT_REQUEST_SOURCE,
  EMBED_HEIGHT_REQUEST_TYPE,
  EMBED_HEIGHT_SOURCE,
  EMBED_HEIGHT_TYPE,
  EMBED_REPORT_SETTLE_MS,
} from '@/shared/constants/embed';
import {
  isReportableEmbedHeight,
  measureEmbedContentHeight,
  resolveEmbedContentElement,
} from '@/shared/lib/embed-height';

/**
 * iframe 嵌入模式下的内容高度上报(协议见 shared/constants/embed)。
 *
 * - 仅在被 iframe 嵌入时生效(顶层打开时 window.parent === window,直接不做事);
 * - 量「内容锚点在文档坐标下的底边」而不是 scrollHeight:scrollHeight 恒 ≥ 视口高,
 *   嵌在 iframe 里时视口高就是父页给的框高,上报值会被托底成永不低于当前框高
 *   (父页只能涨不能跌,切回 10 条时框内留一大片空白)。锚点底边与视口高无关,可增可减;
 * - ResizeObserver 盯内容锚点(不是 document.body):body 的盒高被视口地板撑住,
 *   内容变短时 body 高度根本不变,连「变小了」的信号都发不出来;
 * - 静默期后上报:内容稳定才报,避免连续变化时刷屏;
 * - 数据在途(react-query 有请求未回)时不上报:切路由/翻页会先渲染 loading 态(内容骤缩),
 *   此刻上报会把父页框高打到下限,随后又弹回,观感是「塌陷—弹回」闪烁;
 * - 父页监听器可能晚于本页挂载就绪,故父页会回一条 height-request,本页收到后补报一次。
 */
export function useIframeHeightReporter(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (window.parent === window) return;

    const element = resolveEmbedContentElement();
    if (!element) return;

    let lastReported: number | null = null;
    let timer: number | null = null;

    const flush = () => {
      timer = null;
      // 数据在途:等落定再报,否则 loading 态的矮高度会被父页当真
      if (queryClient.isFetching() > 0) {
        timer = window.setTimeout(flush, EMBED_REPORT_SETTLE_MS);
        return;
      }
      const height = measureEmbedContentHeight(element, window.scrollY);
      if (!isReportableEmbedHeight(height)) return;
      if (height === lastReported) return;
      lastReported = height;
      window.parent.postMessage(
        { source: EMBED_HEIGHT_SOURCE, type: EMBED_HEIGHT_TYPE, height },
        '*',
      );
    };

    const schedule = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(flush, EMBED_REPORT_SETTLE_MS);
    };

    const onRequest = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const data = event.data as { source?: unknown; type?: unknown } | null;
      if (data?.source !== EMBED_HEIGHT_REQUEST_SOURCE) return;
      if (data.type !== EMBED_HEIGHT_REQUEST_TYPE) return;
      // 强制补报:父页监听器可能没收到上一次(去重会吞掉),这里必须再发一遍
      lastReported = null;
      schedule();
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    window.addEventListener('resize', schedule);
    window.addEventListener('message', onRequest);
    schedule();

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('message', onRequest);
    };
  }, [queryClient]);
}
