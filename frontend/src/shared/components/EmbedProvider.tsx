import { createContext, useContext, type ReactNode } from 'react';
import {
  useEmbedAvailableHeight,
  type EmbedAvailableHeightState,
} from '@/shared/hooks/useEmbedAvailableHeight';

const EmbedContext = createContext<EmbedAvailableHeightState>({
  availableHeight: null,
  effectiveHeight: null,
  isEmbedded: false,
  requestAvailableHeight: () => {},
});

/**
 * 嵌入模式的全局上下文(单一监听器、单一握手请求)。
 * 挂在 main.tsx 的 IframeHeightReporter 旁,与高度上报协议并存、互不干扰。
 */
export function EmbedProvider({ children }: { children: ReactNode }) {
  const value = useEmbedAvailableHeight();
  return <EmbedContext.Provider value={value}>{children}</EmbedContext.Provider>;
}

/** 读取嵌入模式状态(availableHeight/effectiveHeight/isEmbedded) */
export function useEmbed(): EmbedAvailableHeightState {
  return useContext(EmbedContext);
}
