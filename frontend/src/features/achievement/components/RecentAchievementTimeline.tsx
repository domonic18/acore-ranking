import type { RecentAchievement } from '../types';

interface RecentAchievementTimelineProps {
  data: RecentAchievement[];
}

function parseDateParts(dateStr: string) {
  const [datePart, timePart] = dateStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
  return { year, month, day, hour, minute, second };
}

function groupByDate(items: RecentAchievement[]) {
  const groups: Record<string, RecentAchievement[]> = {};
  for (const item of items) {
    const { year, month, day } = parseDateParts(item.achievement_date);
    const key = `${year}年${month}月${day}日`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

function formatTime(dateStr: string) {
  const { hour, minute, second } = parseDateParts(dateStr);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
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
