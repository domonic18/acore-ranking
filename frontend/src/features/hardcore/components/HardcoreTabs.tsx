type TabKey = 'completed60' | 'completed70' | 'completed80' | 'fail' | 'incomplete';

interface Tab {
  key: TabKey;
  label: string;
}

const tabs: Tab[] = [
  { key: 'completed60', label: '60级达成' },
  { key: 'completed70', label: '70级达成' },
  { key: 'completed80', label: '80级达成' },
  { key: 'fail', label: '阵亡榜' },
  { key: 'incomplete', label: '奋进榜' },
];

interface HardcoreTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function HardcoreTabs({ activeTab, onTabChange }: HardcoreTabsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === t.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export type { TabKey };
