import { Endpoints } from '@/shared/api/endpoints';
import {
  useGoldRanking,
  usePlaytimeRanking,
  useHonorRanking,
  useKillsRanking,
  useDeathRanking,
  useMonsterKillRanking,
  useCritterKillRanking,
  useFlightPathRanking,
  useHealingPotionRanking,
  useReputationRanking,
  useQuestRanking,
  useLegendaryRanking,
  useTodayKillsRanking,
  useAchievementRanking,
  useMountRanking,
  useDungeon5Ranking,
  useRaid10Ranking,
  useRaid25Ranking,
  useRareItemRanking,
} from './api/queries';
import { CountRankingTable } from './components/CountRankingTable';
import { GoldRankingTable } from './components/GoldRankingTable';
import { PlaytimeRankingTable } from './components/PlaytimeRankingTable';
import { KillsRankingTable } from './components/KillsRankingTable';
import { ReputationRankingTable } from './components/ReputationRankingTable';
import { LegendaryRankingTable } from './components/LegendaryRankingTable';
import { RareItemRankingTable } from './components/RareItemRankingTable';
import { MountRankingTable } from './components/MountRankingTable';
import type { UseQueryResult } from '@tanstack/react-query';
import type { RankPlayer } from './types';

export type TabKey =
  | 'gold'
  | 'playtime'
  | 'honor'
  | 'kills'
  | 'deaths'
  | 'monsterKills'
  | 'critterKills'
  | 'flightPaths'
  | 'healingPotions'
  | 'reputation'
  | 'quest'
  | 'legendary'
  | 'todayKills'
  | 'achievement'
  | 'mount'
  | 'dungeon5'
  | 'raid10'
  | 'raid25'
  | 'rareItems';

export type CategoryKey = 'wealth' | 'character' | 'combat' | 'exploration' | 'instance' | 'collection';

export interface RankingConfigEntry<T extends RankPlayer = RankPlayer> {
  key: TabKey;
  label: string;
  category: CategoryKey;
  endpoint: string;
  useQuery: () => UseQueryResult<T[]>;
  component: React.ComponentType<{ data: T[] }>;
}

function asRankingComponent<T extends RankPlayer>(
  component: React.ComponentType<{ data: T[] }>,
): React.ComponentType<{ data: RankPlayer[] }> {
  return component as React.ComponentType<{ data: RankPlayer[] }>;
}

function createCountComponent<K extends string>(accessorKey: K, header: string) {
  return asRankingComponent((props: { data: import('./types').CountedRankPlayer<K>[] }) => (
    <CountRankingTable {...props} accessorKey={accessorKey} header={header} />
  ));
}

export const rankingConfig: RankingConfigEntry[] = [
  {
    key: 'gold',
    label: '财富排行',
    category: 'wealth',
    endpoint: Endpoints.ranking.gold,
    useQuery: useGoldRanking,
    component: asRankingComponent(GoldRankingTable),
  },
  {
    key: 'playtime',
    label: '时长排行',
    category: 'character',
    endpoint: Endpoints.ranking.playtime,
    useQuery: usePlaytimeRanking,
    component: asRankingComponent(PlaytimeRankingTable),
  },
  {
    key: 'honor',
    label: '荣誉排行',
    category: 'character',
    endpoint: Endpoints.ranking.honor,
    useQuery: useHonorRanking,
    component: () => null,
  },
  {
    key: 'kills',
    label: '击杀排行',
    category: 'combat',
    endpoint: Endpoints.ranking.kills,
    useQuery: useKillsRanking,
    component: asRankingComponent(KillsRankingTable),
  },
  {
    key: 'deaths',
    label: '死亡排行',
    category: 'combat',
    endpoint: Endpoints.ranking.deaths,
    useQuery: useDeathRanking,
    component: createCountComponent('death_count', '死亡次数'),
  },
  {
    key: 'monsterKills',
    label: '杀怪排行',
    category: 'combat',
    endpoint: Endpoints.ranking.monsterKills,
    useQuery: useMonsterKillRanking,
    component: createCountComponent('monster_kill_count', '杀怪数'),
  },
  {
    key: 'critterKills',
    label: '小动物杀手',
    category: 'combat',
    endpoint: Endpoints.ranking.critterKills,
    useQuery: useCritterKillRanking,
    component: createCountComponent('critter_kill_count', '小动物击杀'),
  },
  {
    key: 'flightPaths',
    label: '飞行点排行',
    category: 'exploration',
    endpoint: Endpoints.ranking.flightPaths,
    useQuery: useFlightPathRanking,
    component: createCountComponent('flight_path_count', '飞行点数量'),
  },
  {
    key: 'healingPotions',
    label: '治疗药水',
    category: 'combat',
    endpoint: Endpoints.ranking.healingPotions,
    useQuery: useHealingPotionRanking,
    component: createCountComponent('healing_potion_count', '治疗药水'),
  },
  {
    key: 'reputation',
    label: '声望排行',
    category: 'character',
    endpoint: Endpoints.ranking.reputation,
    useQuery: useReputationRanking,
    component: asRankingComponent(ReputationRankingTable),
  },
  {
    key: 'quest',
    label: '任务排行',
    category: 'character',
    endpoint: Endpoints.ranking.quest,
    useQuery: useQuestRanking,
    component: createCountComponent('quest_count', '完成任务数'),
  },
  {
    key: 'legendary',
    label: '传说装备',
    category: 'collection',
    endpoint: Endpoints.ranking.legendary,
    useQuery: useLegendaryRanking,
    component: asRankingComponent(LegendaryRankingTable),
  },
  {
    key: 'todayKills',
    label: '今日击杀',
    category: 'combat',
    endpoint: Endpoints.ranking.todayKills,
    useQuery: useTodayKillsRanking,
    component: createCountComponent('today_kills', '今日击杀'),
  },
  {
    key: 'achievement',
    label: '成就排行',
    category: 'character',
    endpoint: Endpoints.ranking.achievement,
    useQuery: useAchievementRanking,
    component: createCountComponent('total_achieve_points', '成就点'),
  },
  {
    key: 'mount',
    label: '坐骑排行',
    category: 'collection',
    endpoint: Endpoints.ranking.mount,
    useQuery: useMountRanking,
    component: asRankingComponent(MountRankingTable),
  },
  {
    key: 'rareItems',
    label: '稀有物品',
    category: 'collection',
    endpoint: Endpoints.ranking.rareItems,
    useQuery: useRareItemRanking,
    component: asRankingComponent(RareItemRankingTable),
  },
  {
    key: 'dungeon5',
    label: '5人本',
    category: 'instance',
    endpoint: Endpoints.ranking.dungeon5,
    useQuery: useDungeon5Ranking,
    component: createCountComponent('dungeon_5_count', '5人本次数'),
  },
  {
    key: 'raid10',
    label: '10人团本',
    category: 'instance',
    endpoint: Endpoints.ranking.raid10,
    useQuery: useRaid10Ranking,
    component: createCountComponent('raid_10_count', '10人团本次数'),
  },
  {
    key: 'raid25',
    label: '25人团本',
    category: 'instance',
    endpoint: Endpoints.ranking.raid25,
    useQuery: useRaid25Ranking,
    component: createCountComponent('raid_25_count', '25人团本次数'),
  },
];

export const rankingConfigMap = new Map(rankingConfig.map((c) => [c.key, c]));

export function deriveCategories(config: RankingConfigEntry[]) {
  const map = new Map<CategoryKey, { key: CategoryKey; label: string; tabs: TabKey[] }>();
  for (const entry of config) {
    if (!map.has(entry.category)) {
      map.set(entry.category, {
        key: entry.category,
        label: getCategoryLabel(entry.category),
        tabs: [],
      });
    }
    map.get(entry.category)!.tabs.push(entry.key);
  }
  return Array.from(map.values());
}

function getCategoryLabel(key: CategoryKey): string {
  const labels: Record<CategoryKey, string> = {
    wealth: '财富',
    character: '角色',
    combat: '战斗统计',
    exploration: '探索',
    instance: '副本团本',
    collection: '收藏装备',
  };
  return labels[key];
}

export const rankingCategories = deriveCategories(rankingConfig);
