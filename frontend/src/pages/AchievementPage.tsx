import { useEffect, useRef, useState } from 'react';
import { useRecentAchievements } from '@/features/achievement/api/queries';
import { RecentAchievementTimeline } from '@/features/achievement/components/RecentAchievementTimeline';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useEmbed } from '@/shared/components/EmbedProvider';

/** 底部渐隐高度(px):示意「下面还有内容」 */
const FADE_HEIGHT_PX = 64;

export default function AchievementPage() {
  const { data, isLoading, error } = useRecentAchievements();
  const { effectiveHeight, isEmbedded } = useEmbed();
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLElement>(null);

  // 量内容自然高度:与可用高度比较,决定是否需要裁剪 + 渐隐。
  //
  // 高度只从 ResizeObserver 回调里取(observer 自报尺寸),不在 effect 里读
  // el.scrollHeight / getBoundingClientRect:那些是「读布局」,若此刻 DOM 仍是脏的
  // (React 刚提交完渲染),浏览器会被迫同步重排整篇文档 —— Chrome 直接报
  // "[Violation] Forced reflow while executing JavaScript"。
  // 改用 RO 自报尺寸后,量测不再触碰布局,强制重排消失。
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      // borderBoxSize 含 padding,与原先的 scrollHeight 口径一致(contentRect 不含 padding 会少量)
      const borderBox = Array.isArray(entry.borderBoxSize)
        ? entry.borderBoxSize[0]
        : entry.borderBoxSize;
      const height = borderBox?.blockSize ?? entry.contentRect.height;
      setContentHeight(Math.ceil(height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 嵌入模式:内容裁剪到框高(不产生 iframe 内层滚动条),超出部分由渐隐示意
  const clipped = isEmbedded && effectiveHeight !== null;
  const overflowing = clipped && contentHeight > (effectiveHeight ?? 0);

  return (
    <div
      className={
        clipped
          ? 'overflow-hidden bg-background text-foreground'
          : 'bg-background text-foreground'
      }
      style={clipped ? { height: effectiveHeight ?? undefined } : undefined}
    >
      <main ref={contentRef} className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} />
        ) : data ? (
          <RecentAchievementTimeline data={data} />
        ) : null}
      </main>

      {overflowing && (
        <div
          aria-hidden
          data-testid="achievement-fade"
          className="pointer-events-none fixed inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent"
          style={{ height: FADE_HEIGHT_PX }}
        />
      )}
    </div>
  );
}
