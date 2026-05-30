import { Badge } from '@/shared/components/ui/badge';

interface FactionBadgeProps {
  side: number;
}

export function FactionBadge({ side }: FactionBadgeProps) {
  if (side === 1) {
    return <Badge variant="horde">部落</Badge>;
  }
  return <Badge variant="alliance">联盟</Badge>;
}
