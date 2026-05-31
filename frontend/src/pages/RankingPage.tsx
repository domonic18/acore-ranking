import { useState } from 'react';
import {
  useGoldRanking,
  usePlaytimeRanking,
  useHonorRanking,
  useAchievementRanking,
  useMountRanking,
} from '@/features/ranking/api/queries';
import { RankingTabs, type TabKey } from '@/features/ranking/components/RankingTabs';
import { GoldRankingTable } from '@/features/ranking/components/GoldRankingTable';
import { PlaytimeRankingTable } from '@/features/ranking/components/PlaytimeRankingTable';
import { HonorRankingTable } from '@/features/ranking/components/HonorRankingTable';
import { AchievementRankingTable } from '@/features/ranking/components/AchievementRankingTable';
import { MountRankingTable } from '@/features/ranking/components/MountRankingTable';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('gold');

  const gold = useGoldRanking();
  const playtime = usePlaytimeRanking();
  const honor = useHonorRanking();
  const achievement = useAchievementRanking();
  const mount = useMountRanking();

  const queries = { gold, playtime, honor, achievement, mount };
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
          {activeTab === 'honor' && honor.data && <HonorRankingTable data={honor.data} />}
          {activeTab === 'achievement' && achievement.data && <AchievementRankingTable data={achievement.data} />}
          {activeTab === 'mount' && mount.data && <MountRankingTable data={mount.data} />}
        </>
      ) : null}
    </main>
  );
}
