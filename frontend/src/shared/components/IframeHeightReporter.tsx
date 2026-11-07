import type { ReactNode } from 'react';
import { useIframeHeightReporter } from '@/shared/hooks/useIframeHeightReporter';

/**
 * iframe 嵌入高度上报的挂载点(协议见 shared/constants/embed)。
 * 顶层打开时 hook 直接不做事,本页无任何副作用。
 */
export function IframeHeightReporter({ children }: { children: ReactNode }) {
  useIframeHeightReporter();
  return <>{children}</>;
}
