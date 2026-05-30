interface FactionBadgeProps {
  side: number;
}

export function FactionBadge({ side }: FactionBadgeProps) {
  if (side === 1) {
    return <span className="inline-block rounded bg-horde/20 px-2 py-0.5 text-xs text-horde">部落</span>;
  }
  return <span className="inline-block rounded bg-alliance/20 px-2 py-0.5 text-xs text-alliance">联盟</span>;
}
