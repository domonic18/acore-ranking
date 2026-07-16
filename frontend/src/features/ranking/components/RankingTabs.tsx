import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const container = scrollRef.current;
    const activeButton = activeRef.current;
    if (!container || !activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeButton.getBoundingClientRect();
    const scrollLeft = activeRect.left - containerRect.left + container.scrollLeft - 16;

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }, [activeTab]);

  return (
    <div className="relative mb-4">
      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            ref={t.key === activeTab ? activeRef : null}
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
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export type { TabKey };
