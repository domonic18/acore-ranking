import { Card, CardContent } from '@/shared/components/ui/card';
import { FactionBadge } from '@/shared/components/FactionBadge';
import {
  RACE_NAMES,
  CLASS_NAMES,
  CLASS_COLORS,
  GENDER_NAMES,
} from '@/shared/constants/game';
import type { CharacterInfo } from '../types';

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
          <div className="text-lg font-semibold">
            {RACE_NAMES[info.race]} /{' '}
            <span style={{ color: CLASS_COLORS[info.class] ?? '#fff' }}>
              {CLASS_NAMES[info.class]}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">性别</div>
          <div className="text-lg font-semibold">{GENDER_NAMES[info.gender]}</div>
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
    </div>
  );
}
