import { EMBED_CONTENT_ATTRIBUTE, EMBED_MIN_REPORT_PX } from '@/shared/constants/embed';

/**
 * iframe 嵌入高度上报的量测口径(纯函数,零 IO)。
 *
 * 为什么不用 scrollHeight:scrollHeight 是「文档高 ≥ 视口高」,嵌在 iframe 里时
 * 视口高 = 父页给的框高 → 上报值被视口高托底,内容变短时也永不低于当前框高
 * (父页只能涨不能跌,框内留大片空白)。
 * 改用「内容锚点在文档坐标下的底边」:与视口高无关,可增可减。
 */

/** 取内容锚点元素;不存在返回 null(此时不上报,严禁回退 scrollHeight) */
export function resolveEmbedContentElement(root?: Document | Element): HTMLElement | null {
  const scope = root ?? (typeof document === 'undefined' ? null : document);
  if (!scope) return null;
  return scope.querySelector<HTMLElement>(`[${EMBED_CONTENT_ATTRIBUTE}]`);
}

/**
 * 量内容锚点在文档坐标下的底边(= 内容实际占多高)。
 * scrollY 用于把视口坐标换算回文档坐标(子页自身滚动时依然正确)。
 */
export function measureEmbedContentHeight(element: HTMLElement, scrollY: number): number {
  const rect = element.getBoundingClientRect();
  return Math.ceil(rect.bottom + scrollY);
}

/** 量到的值是否可上报(有限数且不低于下限) */
export function isReportableEmbedHeight(height: number): boolean {
  return Number.isFinite(height) && height >= EMBED_MIN_REPORT_PX;
}
