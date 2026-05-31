interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <div className="text-4xl">⚠</div>
      <p className="text-sm">数据加载失败，请稍后重试</p>
      {message && (
        <p className="max-w-md px-4 text-center text-xs text-destructive">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          重新加载
        </button>
      )}
    </div>
  );
}
