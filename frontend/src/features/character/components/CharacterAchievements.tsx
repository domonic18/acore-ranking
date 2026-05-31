import { useState, useMemo } from 'react';
import { ICON_BASE_URL } from '@/shared/constants/external';
import type { CharacterAchievements as CA } from '../types';

interface CharacterAchievementsProps {
  data: CA;
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('zh-CN');
}

export function CharacterAchievements({ data }: CharacterAchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedParent, setExpandedParent] = useState<number | null>(null);

  const rootCategories = useMemo(() =>
    data.categories.filter((c) => c.parent === -1 && c.id !== 1)
  , [data.categories]);

  const childCategories = useMemo(() =>
    data.categories.filter((c) => c.parent > 0)
  , [data.categories]);

  const displayedAchievements = useMemo(() => {
    if (selectedCategory === null) {
      const recentIds = Object.entries(data.earned)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([id]) => Number(id));
      return recentIds.map((id) => data.achievements.find((a) => a.id === id)).filter(Boolean);
    }
    const children = childCategories.filter((c) => c.parent === selectedCategory).map((c) => c.id);
    return data.achievements.filter((a) =>
      a.category === selectedCategory || children.includes(a.category)
    );
  }, [selectedCategory, data, childCategories]);

  const progress = useMemo(() => {
    const result: { name: string; earned: number; total: number }[] = [];
    let totalEarned = 0;
    let total = 0;
    for (const cat of rootCategories) {
      const children = childCategories.filter((c) => c.parent === cat.id).map((c) => c.id);
      const catAchs = data.achievements.filter((a) => a.category === cat.id || children.includes(a.category));
      const earned = catAchs.filter((a) => data.earned[a.id]).length;
      totalEarned += earned;
      total += catAchs.length;
      result.push({ name: cat.name, earned, total: catAchs.length });
    }
    result.unshift({ name: '总计', earned: totalEarned, total });
    return result;
  }, [data, rootCategories, childCategories]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="space-y-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${selectedCategory === null ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
        >
          最近获得
        </button>
        {rootCategories.map((cat) => {
          const children = childCategories.filter((c) => c.parent === cat.id);
          const isExpanded = expandedParent === cat.id;
          return (
            <div key={cat.id}>
              <button
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (children.length > 0) setExpandedParent(isExpanded ? null : cat.id);
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              >
                {cat.name}
              </button>
              {isExpanded && children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedCategory(child.id)}
                  className={`ml-4 w-full rounded px-3 py-1.5 text-left text-xs transition-colors ${selectedCategory === child.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div className="md:col-span-3 space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">
              {selectedCategory === null ? '最近获得' : data.categories.find((c) => c.id === selectedCategory)?.name}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
              成就点数: {data.totalPoints}
            </span>
          </div>

          <div className="space-y-2">
            {displayedAchievements.map((ach) => {
              if (!ach) return null;
              const isEarned = !!data.earned[ach.id];
              return (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 rounded-lg border p-2 ${isEarned ? 'border-border bg-card' : 'border-dashed border-muted-foreground/20 bg-muted/30 opacity-50 grayscale'}`}
                >
                  <div className={`h-10 w-10 shrink-0 overflow-hidden rounded ${isEarned ? '' : 'opacity-50'}`}>
                    {ach.icon ? (
                      <img src={`${ICON_BASE_URL}/${ach.icon.toLowerCase()}.jpg`} alt="" className="h-10 w-10" loading="lazy" />
                    ) : (
                      <div className="h-10 w-10 bg-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-sm font-medium ${isEarned ? '' : 'text-muted-foreground/60'}`}>{ach.title}</div>
                    <div className={`truncate text-xs ${isEarned ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>{ach.description}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`text-sm font-semibold ${isEarned ? '' : 'text-muted-foreground/50'}`}>{ach.points}</div>
                    {isEarned && (
                      <div className="text-xs text-muted-foreground">{formatDate(data.earned[ach.id])}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 font-semibold">进度概览</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {progress.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.earned} / {p.total}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${p.total > 0 ? (p.earned / p.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
