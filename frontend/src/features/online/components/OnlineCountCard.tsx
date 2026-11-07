import { Card, CardContent } from '@/shared/components/ui/card';
import type { MultiBoxStats } from '../utils/multiBox';
import type { OnlineCount } from '../types';

interface OnlineCountCardProps {
  count: OnlineCount;
  multiBox?: MultiBoxStats;
}

export function OnlineCountCard({ count, multiBox }: OnlineCountCardProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-3xl font-bold text-primary">{count.total_count}</div>
          <div className="text-sm text-muted-foreground">在线总数</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-3xl font-bold text-alliance">{count.alliance_count}</div>
          <div className="text-sm text-muted-foreground">联盟</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-3xl font-bold text-horde">{count.horde_count}</div>
          <div className="text-sm text-muted-foreground">部落</div>
        </CardContent>
      </Card>
      {multiBox && (
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-amber-500">{multiBox.groups}</div>
            <div className="text-sm text-muted-foreground">
              同IP多开组 · 涉及 {multiBox.players} 角色
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
