import { useParams } from 'react-router-dom';
import { useCharacterInfo, useCharacterItems } from '@/features/character/api/queries';
import { CharacterProfile } from '@/features/character/components/CharacterProfile';
import { CharacterEquipment } from '@/features/character/components/CharacterEquipment';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';

export default function CharacterPage() {
  const { name } = useParams<{ name: string }>();
  const { data: info, isLoading: infoLoading, error: infoError } = useCharacterInfo(name ?? '');
  const { data: items, isLoading: itemsLoading } = useCharacterItems(name ?? '');

  if (infoLoading) return <LoadingState />;
  if (infoError) return <ErrorState message={infoError.message} />;
  if (!info) return <ErrorState message="角色不存在" />;

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{info.name}</h1>

      <CharacterProfile info={info} />

      <h2 className="mb-2 text-lg font-semibold">装备</h2>
      {itemsLoading ? (
        <LoadingState />
      ) : items && items.length > 0 ? (
        <CharacterEquipment items={items} />
      ) : (
        <p className="text-muted-foreground">无装备数据</p>
      )}
    </main>
  );
}
