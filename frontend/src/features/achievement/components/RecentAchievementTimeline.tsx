import type { RecentAchievement } from '../types';

interface RecentAchievementTimelineProps {
  data: RecentAchievement[];
}

function groupByDate(items: RecentAchievement[]) {
  const groups: Record<string, RecentAchievement[]> = {};
  for (const item of items) {
    const dateStr = new Date(item.achievement_date * 1000).toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(item);
  }
  return groups;
}

function formatTime(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function RecentAchievementTimeline({ data }: RecentAchievementTimelineProps) {
  const grouped = groupByDate(data);

  return (
    <div className="relative pl-6">
      {/* 时间轴线 */}
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-orange-500/60" />

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, achievements]) => (
          <div key={date}>
            {/* 日期分隔符 */}
            <div className="relative flex items-center gap-3">
              <div className="absolute -left-6 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-orange-500" />
              <h2 className="text-base font-bold text-orange-400">{date}</h2>
            </div>

            {/* 成就列表 */}
            <div className="mt-2 space-y-2 pl-1">
              {achievements.map((a, idx) => (
                <div
                  key={`${a.guid}-${a.achievement_date}-${idx}`}
                  className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs"
                >
                  <span className="text-muted-foreground shrink-0">{formatTime(a.achievement_date)}</span>
                  <span className="font-bold text-sky-400 shrink-0">{a.name}</span>
                  <span className="text-muted-foreground shrink-0">({a.level}级)</span>
                  <span className="text-muted-foreground shrink-0">获得成就</span>
                  <span className="font-bold text-yellow-400 shrink-0">[{a.achievement_description}]</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
