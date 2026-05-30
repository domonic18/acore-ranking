interface FactionBadgeProps {
  side: number;
}

export function FactionBadge({ side }: FactionBadgeProps) {
  if (side === 1) {
    return <img src="/assets/icons/horde.gif" width={16} height={16} alt="部落" className="inline-block" />;
  }
  return <img src="/assets/icons/alliance.gif" width={16} height={16} alt="联盟" className="inline-block" />;
}
