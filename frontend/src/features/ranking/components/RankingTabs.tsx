import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLabel = tabs.find((t) => t.key === activeTab)?.label ?? activeTab;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleSelect(key: TabKey) {
    onTabChange(key);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg bg-secondary px-4 py-3 text-left text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80',
          open && 'bg-secondary/80'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{activeLabel}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-[60vh] w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="option"
              aria-selected={t.key === activeTab}
              onClick={() => handleSelect(t.key)}
              className={cn(
                'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                t.key === activeTab
                  ? 'bg-primary text-primary-foreground'
                  : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type { TabKey };
