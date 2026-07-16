import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type TabKey = 'gold' | 'playtime' | 'honor' | 'kills' | 'deaths' | 'monsterKills' | 'critterKills' | 'flightPaths' | 'healingPotions' | 'reputation' | 'quest' | 'legendary' | 'todayKills' | 'achievement' | 'mount';

interface Tab {
  key: TabKey;
  label: string;
}

const tabs: Tab[] = [
  { key: 'gold', label: '财富排行' },
  { key: 'playtime', label: '时长排行' },
  // { key: 'honor', label: '荣誉排行' },
  { key: 'kills', label: '击杀排行' },
  { key: 'deaths', label: '死亡排行' },
  { key: 'monsterKills', label: '杀怪排行' },
  { key: 'critterKills', label: '小动物杀手' },
  { key: 'flightPaths', label: '飞行点排行' },
  { key: 'healingPotions', label: '治疗药水' },
  { key: 'reputation', label: '声望排行' },
  { key: 'quest', label: '任务排行' },
  { key: 'legendary', label: '传说装备' },
  { key: 'todayKills', label: '今日击杀' },
  { key: 'achievement', label: '成就排行' },
  { key: 'mount', label: '坐骑排行' },
];

interface RankingTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function RankingTabs({ activeTab, onTabChange }: RankingTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    const activeButton = activeRef.current;
    if (!container || !activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeButton.getBoundingClientRect();
    const target = activeRect.left - containerRect.left + container.scrollLeft - 16;

    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [activeTab]);

  function scrollBy(direction: 'left' | 'right') {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.6;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  return (
    <div className="relative mb-4 flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollBy('left')}
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-opacity hover:bg-secondary/80',
          canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-label="向左滚动"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-2 overflow-x-auto py-1"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              ref={t.key === activeTab ? activeRef : null}
              type="button"
              onClick={() => onTabChange(t.key)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeTab === t.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent" />
        )}
      </div>

      <button
        type="button"
        onClick={() => scrollBy('right')}
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-opacity hover:bg-secondary/80',
          canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-label="向右滚动"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export type { TabKey };
