/**
 * iframe 嵌入高度上报协议(跨仓契约)。
 *
 * 背景:本服务被门户 acore-portal 以 iframe 嵌入(英雄榜/在线玩家/在线地图/封号记录)。
 * 父页只能给 iframe 一个固定高度,内容超出即产生 iframe 内层滚动,底部被截。
 * 子页把内容高度上报给父页、父页据此撑高 iframe,可消掉这层嵌套滚动。
 *
 * 另有一条反向协议:父页把自己给 iframe 的**可用高度**下发子页,子页据此裁剪内容
 * (首页「最近成就」嵌入用——该处要求成就块与首页右栏等高,不能靠撑高 iframe 解决,
 *  只能由子页把内容裁剪到框高,底部渐隐示意还有内容)。
 *
 * 协议:
 *   子 → 父  { source: 'acore-ranking', type: 'height', height: number }
 *   父 → 子  { source: 'acore-portal',  type: 'height-request' }   (握手:父页监听器就绪后补要一次)
 *   子 → 父  { source: 'acore-ranking', type: 'available-height-request' }  (握手:索要可用高度)
 *   父 → 子  { source: 'acore-portal',  type: 'height-available', height: number }
 *
 * 对端实现:acore-portal src/components/site/achievement-embed.tsx + src/components/site/tools-iframe.tsx
 */

/** 子页 → 父页 的消息来源标识 */
export const EMBED_HEIGHT_SOURCE = 'acore-ranking';

/** 子页 → 父页 的消息类型:上报高度 */
export const EMBED_HEIGHT_TYPE = 'height';

/** 父页 → 子页 的消息来源标识 */
export const EMBED_HEIGHT_REQUEST_SOURCE = 'acore-portal';

/** 父页 → 子页 的消息类型:索要高度(握手补报) */
export const EMBED_HEIGHT_REQUEST_TYPE = 'height-request';

/** 高度上报消息体 */
export interface EmbedHeightMessage {
  source: typeof EMBED_HEIGHT_SOURCE;
  type: typeof EMBED_HEIGHT_TYPE;
  height: number;
}

/** 子页 → 父页 的消息类型:索要可用高度(握手补要) */
export const EMBED_AVAILABLE_HEIGHT_REQUEST_TYPE = 'available-height-request';

/** 父页 → 子页 的消息类型:下发可用高度 */
export const EMBED_AVAILABLE_HEIGHT_TYPE = 'height-available';

/** 可用高度下发消息体 */
export interface EmbedHeightAvailableMessage {
  source: typeof EMBED_HEIGHT_REQUEST_SOURCE;
  type: typeof EMBED_AVAILABLE_HEIGHT_TYPE;
  height: number;
}

/**
 * 内容锚点属性名:高度上报的量测对象。
 * 锚点在 app/main.tsx 包住 RouterProvider,跨全部路由稳定存在;
 * 父页不感知该属性(纯子站内部约定)。
 */
export const EMBED_CONTENT_ATTRIBUTE = 'data-embed-content';

/**
 * 上报静默期(ms):内容变化后等这么久再上报。
 * 切路由/翻页会先渲染 loading 态(内容骤缩),立即上报会让父页框高先塌后弹。
 */
export const EMBED_REPORT_SETTLE_MS = 200;

/** 上报下限(px):量到更小的值视为未渲染/异常,不上报(避免把父页框高打塌) */
export const EMBED_MIN_REPORT_PX = 80;
