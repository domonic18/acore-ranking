import { useParams } from 'react-router-dom';

export default function CharacterPage() {
  const { name } = useParams<{ name: string }>();

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Character / 角色信息</h1>
      <p className="text-muted-foreground">Name: {name}</p>
    </main>
  );
}
