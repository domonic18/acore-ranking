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
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
