import { Card, CardContent } from '@/shared/components/ui/card';
import { FactionBadge } from '@/shared/components/FactionBadge';
import { RaceIcon, ClassIcon } from '@/shared/components/RaceClassIcons';
import type { CharacterInfo } from '../types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

interface CharacterProfileProps {
  info: CharacterInfo;
}

export function CharacterProfile({ info }: CharacterProfileProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">等级</div>
          <div className="text-lg font-semibold">{info.level}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">种族 / 职业</div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            <RaceIcon race={info.race} gender={info.gender} size={28} />
            <ClassIcon class={info.class} size={28} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">阵营</div>
          <div className="text-lg font-semibold">
            <FactionBadge side={info.side} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">公会</div>
          <div className="text-lg font-semibold">{info.guild ?? '无'}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">生命值</div>
          <div className="text-lg font-semibold">{info.health}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">游戏时间</div>
          <div className="text-lg font-semibold">{info.total_time_str}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">荣誉点</div>
          <div className="text-lg font-semibold">{info.total_honor_points}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">击杀数</div>
          <div className="text-lg font-semibold">{info.total_kills}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">竞技场点数</div>
          <div className="text-lg font-semibold">{info.arena_points}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">完成任务</div>
          <div className="text-lg font-semibold">{info.quest_count}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">成就数</div>
          <div className="text-lg font-semibold">{info.achievement_count}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">注册时间</div>
          <div className="text-lg font-semibold">{formatDate(info.creation_date)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">上次登录</div>
          <div className="text-lg font-semibold">{formatDate(info.last_login)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
