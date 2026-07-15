import { useState } from 'react';
import {
  useGoldRanking,
  usePlaytimeRanking,
  useHonorRanking,
  useKillsRanking,
  useDeathRanking,
  useReputationRanking,
  useQuestRanking,
  useLegendaryRanking,
  useTodayKillsRanking,
  useAchievementRanking,
  useMountRanking,
} from '@/features/ranking/api/queries';
import { RankingTabs, type TabKey } from '@/features/ranking/components/RankingTabs';
import { GoldRankingTable } from '@/features/ranking/components/GoldRankingTable';
import { PlaytimeRankingTable } from '@/features/ranking/components/PlaytimeRankingTable';
// import { HonorRankingTable } from '@/features/ranking/components/HonorRankingTable';
import { KillsRankingTable } from '@/features/ranking/components/KillsRankingTable';
// import { DeathRankingTable } from '@/features/ranking/components/DeathRankingTable';
import { ReputationRankingTable } from '@/features/ranking/components/ReputationRankingTable';
import { QuestRankingTable } from '@/features/ranking/components/QuestRankingTable';
import { LegendaryRankingTable } from '@/features/ranking/components/LegendaryRankingTable';
import { TodayKillsRankingTable } from '@/features/ranking/components/TodayKillsRankingTable';
import { AchievementRankingTable } from '@/features/ranking/components/AchievementRankingTable';
import { MountRankingTable } from '@/features/ranking/components/MountRankingTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('gold');

  const gold = useGoldRanking();
  const playtime = usePlaytimeRanking();
  const honor = useHonorRanking();
  const kills = useKillsRanking();
  const deaths = useDeathRanking();
  const reputation = useReputationRanking();
  const quest = useQuestRanking();
  const legendary = useLegendaryRanking();
  const todayKills = useTodayKillsRanking();
  const achievement = useAchievementRanking();
  const mount = useMountRanking();

  const queries = { gold, playtime, honor, kills, deaths, reputation, quest, legendary, todayKills, achievement, mount };
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
          {/* {activeTab === 'deaths' && deaths.data && <DeathRankingTable data={deaths.data} />} */}
          {activeTab === 'reputation' && reputation.data && <ReputationRankingTable data={reputation.data} />}
          {activeTab === 'quest' && quest.data && <QuestRankingTable data={quest.data} />}
          {activeTab === 'legendary' && legendary.data && <LegendaryRankingTable data={legendary.data} />}
          {activeTab === 'todayKills' && todayKills.data && <TodayKillsRankingTable data={todayKills.data} />}
          {activeTab === 'achievement' && achievement.data && <AchievementRankingTable data={achievement.data} />}
          {activeTab === 'mount' && mount.data && <MountRankingTable data={mount.data} />}
        </>
      ) : null}
    </main>
  );
}
