type TabKey = 'bans' | 'mutes';

interface Tab {
  key: TabKey;
  label: string;
}

const tabs: Tab[] = [
  { key: 'bans', label: '封禁列表' },
  { key: 'mutes', label: '禁言列表' },
];

interface BanlistTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function BanlistTabs({ activeTab, onTabChange }: BanlistTabsProps) {
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
