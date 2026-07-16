import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type TabKey = 'gold' | 'playtime' | 'honor' | 'kills' | 'deaths' | 'monsterKills' | 'critterKills' | 'flightPaths' | 'healingPotions' | 'reputation' | 'quest' | 'legendary' | 'todayKills' | 'achievement' | 'mount' | 'dungeon5' | 'raid10' | 'raid25';

type CategoryKey = 'character' | 'combat' | 'instance' | 'collection';

interface Tab {
  key: TabKey;
  label: string;
}

interface Category {
  key: CategoryKey;
  label: string;
  tabs: TabKey[];
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
  { key: 'dungeon5', label: '5人本' },
  { key: 'raid10', label: '10人团本' },
  { key: 'raid25', label: '25人团本' },
];

const categories: Category[] = [
  {
    key: 'character',
    label: '角色',
    tabs: ['gold', 'playtime', 'kills', 'deaths', 'reputation', 'quest', 'achievement'],
  },
  {
    key: 'combat',
    label: '战斗统计',
    tabs: ['monsterKills', 'critterKills', 'flightPaths', 'healingPotions', 'todayKills'],
  },
  {
    key: 'instance',
    label: '副本团本',
    tabs: ['dungeon5', 'raid10', 'raid25'],
  },
  {
    key: 'collection',
    label: '收藏装备',
    tabs: ['legendary', 'mount'],
  },
];

const tabMap = new Map(tabs.map((t) => [t.key, t]));

interface RankingTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function RankingTabs({ activeTab, onTabChange }: RankingTabsProps) {
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCategory = categories.find((c) => c.tabs.includes(activeTab)) ?? categories[0];

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenCategory(null);
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenCategory(null);
    }

    if (openCategory) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [openCategory]);

  function handleCategoryClick(category: Category) {
    setOpenCategory((prev) => (prev === category.key ? null : category.key));
  }

  function handleSelect(key: TabKey) {
    onTabChange(key);
    setOpenCategory(null);
  }

  return (
    <div className="relative mb-4" ref={containerRef}>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto py-1">
        {categories.map((cat) => {
          const isActive = activeCategory.key === cat.key;
          const isOpen = openCategory === cat.key;

          return (
            <button
              key={cat.key}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {cat.label}
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
          );
        })}
      </div>

      {openCategory && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-2 w-full rounded-md border border-border bg-card p-2 shadow-lg sm:min-w-[240px] sm:max-w-sm"
        >
          {categories
            .find((c) => c.key === openCategory)!
            .tabs.map((key) => {
              const tab = tabMap.get(key)!;
              const selected = activeTab === key;

              return (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors',
                    selected
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary'
                  )}
                >
                  {tab.label}
                  {selected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export type { TabKey };
