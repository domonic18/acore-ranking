export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-destructive">
      <p>加载失败: {message}</p>
    </div>
  );
}
