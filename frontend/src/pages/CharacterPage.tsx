import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCharacterInfo, useCharacterItems, useCharacterTalents, useCharacterAchievements } from '@/features/character/api/queries';
import { CharacterProfile } from '@/features/character/components/CharacterProfile';
import { CharacterEquipment } from '@/features/character/components/CharacterEquipment';
import { CharacterTalents } from '@/features/character/components/CharacterTalents';
import { CharacterAchievements } from '@/features/character/components/CharacterAchievements';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function CharacterPage() {
  const { name } = useParams<{ name: string }>();
  const [activeTab, setActiveTab] = useState('profile');

  const { data: info, isLoading: infoLoading, error: infoError } = useCharacterInfo(name ?? '');
  const { data: items, isLoading: itemsLoading } = useCharacterItems(name ?? '');
  const { data: talents, isLoading: talentsLoading } = useCharacterTalents(name ?? '');
  const { data: achievements, isLoading: achievementsLoading } = useCharacterAchievements(name ?? '');

  if (infoLoading) return <LoadingState />;
  if (infoError) return <ErrorState message={infoError.message} />;
  if (!info) return <ErrorState message="角色不存在" />;

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{info.name}</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">基础信息</TabsTrigger>
          <TabsTrigger value="equipment">装备</TabsTrigger>
          <TabsTrigger value="talents">天赋</TabsTrigger>
          <TabsTrigger value="achievements">成就</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <CharacterProfile info={info} />
        </TabsContent>

        <TabsContent value="equipment">
          {itemsLoading ? (
            <LoadingState />
          ) : items && items.length > 0 ? (
            <CharacterEquipment items={items} />
          ) : (
            <p className="text-muted-foreground">无装备数据</p>
          )}
        </TabsContent>

        <TabsContent value="talents">
          {talentsLoading ? (
            <LoadingState />
          ) : talents ? (
            <CharacterTalents data={talents} />
          ) : (
            <p className="text-muted-foreground">无天赋数据</p>
          )}
        </TabsContent>

        <TabsContent value="achievements">
          {achievementsLoading ? (
            <LoadingState />
          ) : achievements ? (
            <CharacterAchievements data={achievements} />
          ) : (
            <p className="text-muted-foreground">无成就数据</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
