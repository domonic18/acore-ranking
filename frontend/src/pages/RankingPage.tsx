import { useState } from 'react';
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
} from '@/features/ranking/api/queries';
import { RankingTabs, type TabKey } from '@/features/ranking/components/RankingTabs';
import { GoldRankingTable } from '@/features/ranking/components/GoldRankingTable';
import { PlaytimeRankingTable } from '@/features/ranking/components/PlaytimeRankingTable';
// import { HonorRankingTable } from '@/features/ranking/components/HonorRankingTable';
import { KillsRankingTable } from '@/features/ranking/components/KillsRankingTable';
import { DeathRankingTable } from '@/features/ranking/components/DeathRankingTable';
import { MonsterKillRankingTable } from '@/features/ranking/components/MonsterKillRankingTable';
import { CritterKillRankingTable } from '@/features/ranking/components/CritterKillRankingTable';
import { FlightPathRankingTable } from '@/features/ranking/components/FlightPathRankingTable';
import { HealingPotionRankingTable } from '@/features/ranking/components/HealingPotionRankingTable';
import { ReputationRankingTable } from '@/features/ranking/components/ReputationRankingTable';
import { QuestRankingTable } from '@/features/ranking/components/QuestRankingTable';
import { LegendaryRankingTable } from '@/features/ranking/components/LegendaryRankingTable';
import { TodayKillsRankingTable } from '@/features/ranking/components/TodayKillsRankingTable';
import { AchievementRankingTable } from '@/features/ranking/components/AchievementRankingTable';
import { MountRankingTable } from '@/features/ranking/components/MountRankingTable';
import { Dungeon5RankingTable } from '@/features/ranking/components/Dungeon5RankingTable';
import { Raid10RankingTable } from '@/features/ranking/components/Raid10RankingTable';
import { Raid25RankingTable } from '@/features/ranking/components/Raid25RankingTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('gold');

  const gold = useGoldRanking();
  const playtime = usePlaytimeRanking();
  const honor = useHonorRanking();
  const kills = useKillsRanking();
  const deaths = useDeathRanking();
  const monsterKills = useMonsterKillRanking();
  const critterKills = useCritterKillRanking();
  const flightPaths = useFlightPathRanking();
  const healingPotions = useHealingPotionRanking();
  const reputation = useReputationRanking();
  const quest = useQuestRanking();
  const legendary = useLegendaryRanking();
  const todayKills = useTodayKillsRanking();
  const achievement = useAchievementRanking();
  const mount = useMountRanking();
  const dungeon5 = useDungeon5Ranking();
  const raid10 = useRaid10Ranking();
  const raid25 = useRaid25Ranking();

  const queries = { gold, playtime, honor, kills, deaths, monsterKills, critterKills, flightPaths, healingPotions, reputation, quest, legendary, todayKills, achievement, mount, dungeon5, raid10, raid25 };
  const current = queries[activeTab];

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <RankingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {current.isLoading ? (
        <LoadingState />
      ) : current.error ? (
        <ErrorState message={current.error.message} />
      ) : current.data ? (
        <>
          {activeTab === 'gold' && gold.data && <GoldRankingTable data={gold.data} />}
          {activeTab === 'playtime' && playtime.data && <PlaytimeRankingTable data={playtime.data} />}
          {/* {activeTab === 'honor' && honor.data && <HonorRankingTable data={honor.data} />} */}
          {activeTab === 'kills' && kills.data && <KillsRankingTable data={kills.data} />}
          {activeTab === 'deaths' && deaths.data && <DeathRankingTable data={deaths.data} />}
          {activeTab === 'monsterKills' && monsterKills.data && <MonsterKillRankingTable data={monsterKills.data} />}
          {activeTab === 'critterKills' && critterKills.data && <CritterKillRankingTable data={critterKills.data} />}
          {activeTab === 'flightPaths' && flightPaths.data && <FlightPathRankingTable data={flightPaths.data} />}
          {activeTab === 'healingPotions' && healingPotions.data && <HealingPotionRankingTable data={healingPotions.data} />}
          {activeTab === 'reputation' && reputation.data && <ReputationRankingTable data={reputation.data} />}
          {activeTab === 'quest' && quest.data && <QuestRankingTable data={quest.data} />}
          {activeTab === 'legendary' && legendary.data && <LegendaryRankingTable data={legendary.data} />}
          {activeTab === 'todayKills' && todayKills.data && <TodayKillsRankingTable data={todayKills.data} />}
          {activeTab === 'achievement' && achievement.data && <AchievementRankingTable data={achievement.data} />}
          {activeTab === 'mount' && mount.data && <MountRankingTable data={mount.data} />}
          {activeTab === 'dungeon5' && dungeon5.data && <Dungeon5RankingTable data={dungeon5.data} />}
          {activeTab === 'raid10' && raid10.data && <Raid10RankingTable data={raid10.data} />}
          {activeTab === 'raid25' && raid25.data && <Raid25RankingTable data={raid25.data} />}
        </>
      ) : null}
    </main>
  );
}
