import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  rankingConfig,
  rankingConfigMap,
  rankingCategories,
  type TabKey,
  type CategoryKey,
} from '../rankingConfig';

interface RankingTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function RankingTabs({ activeTab, onTabChange }: RankingTabsProps) {
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCategory = rankingCategories.find((c) => c.tabs.includes(activeTab)) ?? rankingCategories[0];

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

  function handleCategoryClick(categoryKey: CategoryKey, event: React.MouseEvent<HTMLButtonElement>) {
    if (openCategory === categoryKey) {
      setOpenCategory(null);
      return;
    }

    const button = event.currentTarget;
    const container = containerRef.current;
    if (!container) return;

    setDropdownLeft(button.offsetLeft - container.scrollLeft);
    setOpenCategory(categoryKey);
  }

  function handleSelect(key: TabKey) {
    onTabChange(key);
    setOpenCategory(null);
  }

  return (
    <div className="relative mb-4" ref={containerRef}>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto py-1">
        {rankingCategories.map((cat) => {
          const isActive = activeCategory.key === cat.key;
          const isOpen = openCategory === cat.key;

          return (
            <button
              key={cat.key}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              onClick={(e) => handleCategoryClick(cat.key, e)}
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

      {openCategory && dropdownLeft !== undefined && (
        <div
          role="listbox"
          style={{ left: dropdownLeft }}
          className="absolute top-full z-50 mt-2 min-w-[160px] rounded-md border border-border bg-card p-2 shadow-lg sm:min-w-[240px] sm:max-w-sm"
        >
          {rankingConfig
            .filter((c) => c.category === openCategory)
            .map((config) => {
              const selected = activeTab === config.key;

              return (
                <button
                  key={config.key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(config.key)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors',
                    selected
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary'
                  )}
                >
                  {config.label}
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
export { rankingConfig, rankingConfigMap };
