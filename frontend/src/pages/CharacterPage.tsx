import { useParams } from 'react-router-dom';
import { useCharacterInfo, useCharacterItems } from '@/features/character/api/queries';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { FactionBadge } from '@/shared/components/FactionBadge';
import {
  RACE_NAMES,
  CLASS_NAMES,
  CLASS_COLORS,
  GENDER_NAMES,
  QUALITY_COLORS,
} from '@/shared/constants/game';

export default function CharacterPage() {
  const { name } = useParams<{ name: string }>();
  const { data: info, isLoading: infoLoading, error: infoError } = useCharacterInfo(name ?? '');
  const { data: items, isLoading: itemsLoading } = useCharacterItems(name ?? '');

  if (infoLoading) return <LoadingSpinner />;
  if (infoError) return <ErrorMessage message={infoError.message} />;
  if (!info) return <ErrorMessage message="角色不存在" />;

  const slotNames: Record<number, string> = {
    0: '头部', 1: '颈部', 2: '肩部', 3: '衬衫', 4: '胸甲',
    5: '腰带', 6: '腿部', 7: '靴子', 8: '护腕', 9: '手套',
    10: '戒指', 11: '戒指', 12: '饰品', 13: '饰品',
    14: '背部', 15: '主手', 16: '副手', 17: '远程', 18: '战袍',
  };

  return (
    <main className="mx-auto w-full min-w-[320px] max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{info.name}</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">等级</div>
          <div className="text-lg font-semibold">{info.level}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">种族 / 职业</div>
          <div className="text-lg font-semibold">
            {RACE_NAMES[info.race]} /{' '}
            <span style={{ color: CLASS_COLORS[info.class] ?? '#fff' }}>
              {CLASS_NAMES[info.class]}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">性别</div>
          <div className="text-lg font-semibold">{GENDER_NAMES[info.gender]}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">阵营</div>
          <div className="text-lg font-semibold">
            <FactionBadge side={info.side} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">生命值</div>
          <div className="text-lg font-semibold">{info.health}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">游戏时间</div>
          <div className="text-lg font-semibold">{info.total_time_str}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">荣誉点</div>
          <div className="text-lg font-semibold">{info.total_honor_points}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">击杀数</div>
          <div className="text-lg font-semibold">{info.total_kills}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">竞技场点数</div>
          <div className="text-lg font-semibold">{info.arena_points}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">完成任务</div>
          <div className="text-lg font-semibold">{info.quest_count}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground">成就数</div>
          <div className="text-lg font-semibold">{info.achievement_count}</div>
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold">装备</h2>
      {itemsLoading ? (
        <LoadingSpinner />
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.item_guid}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-secondary text-xs text-muted-foreground">
                {slotNames[item.slot] ?? item.slot}
              </div>
              <div className="min-w-0">
                <div
                  className="truncate font-medium"
                  style={{ color: QUALITY_COLORS[item.quality] ?? '#fff' }}
                >
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  物品等级 {item.item_entry}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">无装备数据</p>
      )}
    </main>
  );
}
