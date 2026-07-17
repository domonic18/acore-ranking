import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Endpoints } from '@/shared/api/endpoints';
import type {
  GoldRankPlayer,
  PlaytimeRankPlayer,
  HonorRankPlayer,
  KillsRankPlayer,
  DeathRankPlayer,
  MonsterKillRankPlayer,
  CritterKillRankPlayer,
  FlightPathRankPlayer,
  HealingPotionRankPlayer,
  ReputationRankPlayer,
  QuestRankPlayer,
  LegendaryRankPlayer,
  TodayKillsRankPlayer,
  AchievementRankPlayer,
  MountRankPlayer,
  Dungeon5RankPlayer,
  Raid10RankPlayer,
  Raid25RankPlayer,
  RareItemRankPlayer,
  RankPlayer,
} from '../types';

function createRankingQuery<T extends RankPlayer>(queryKey: string, endpoint: string) {
  return function useRankingQuery() {
    return useQuery<T[]>({
      queryKey: ['ranking', queryKey],
      queryFn: () => apiClient.get(endpoint),
    });
  };
}

export const useGoldRanking = createRankingQuery<GoldRankPlayer>('gold', Endpoints.ranking.gold);
export const usePlaytimeRanking = createRankingQuery<PlaytimeRankPlayer>('playtime', Endpoints.ranking.playtime);
export const useHonorRanking = createRankingQuery<HonorRankPlayer>('honor', Endpoints.ranking.honor);
export const useKillsRanking = createRankingQuery<KillsRankPlayer>('kills', Endpoints.ranking.kills);
export const useDeathRanking = createRankingQuery<DeathRankPlayer>('deaths', Endpoints.ranking.deaths);
export const useMonsterKillRanking = createRankingQuery<MonsterKillRankPlayer>('monsterKills', Endpoints.ranking.monsterKills);
export const useCritterKillRanking = createRankingQuery<CritterKillRankPlayer>('critterKills', Endpoints.ranking.critterKills);
export const useFlightPathRanking = createRankingQuery<FlightPathRankPlayer>('flightPaths', Endpoints.ranking.flightPaths);
export const useHealingPotionRanking = createRankingQuery<HealingPotionRankPlayer>('healingPotions', Endpoints.ranking.healingPotions);
export const useReputationRanking = createRankingQuery<ReputationRankPlayer>('reputation', Endpoints.ranking.reputation);
export const useQuestRanking = createRankingQuery<QuestRankPlayer>('quest', Endpoints.ranking.quest);
export const useLegendaryRanking = createRankingQuery<LegendaryRankPlayer>('legendary', Endpoints.ranking.legendary);
export const useTodayKillsRanking = createRankingQuery<TodayKillsRankPlayer>('todayKills', Endpoints.ranking.todayKills);
export const useAchievementRanking = createRankingQuery<AchievementRankPlayer>('achievement', Endpoints.ranking.achievement);
export const useMountRanking = createRankingQuery<MountRankPlayer>('mount', Endpoints.ranking.mount);
export const useDungeon5Ranking = createRankingQuery<Dungeon5RankPlayer>('dungeon5', Endpoints.ranking.dungeon5);
export const useRaid10Ranking = createRankingQuery<Raid10RankPlayer>('raid10', Endpoints.ranking.raid10);
export const useRaid25Ranking = createRankingQuery<Raid25RankPlayer>('raid25', Endpoints.ranking.raid25);
export const useRareItemRanking = createRankingQuery<RareItemRankPlayer>('rareItems', Endpoints.ranking.rareItems);
