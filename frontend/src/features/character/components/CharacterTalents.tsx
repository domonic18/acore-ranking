import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ICON_BASE_URL } from '@/shared/constants/external';
import type { CharacterTalents } from '../types';

interface CharacterTalentsProps {
  data: CharacterTalents;
}

function TalentTreeView({ tree, learnedSpells }: { tree: CharacterTalents['trees'][0]; learnedSpells: Set<number> }) {
  const maxTier = Math.max(...tree.spells.map((s) => s.tierId), 0);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-3 flex items-center gap-2">
        {tree.icon && (
          <img
            src={`${ICON_BASE_URL}/${tree.icon}.jpg`}
            alt={tree.name}
            className="h-8 w-8 rounded"
            loading="lazy"
          />
        )}
        <span className="font-semibold">{tree.name}</span>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {Array.from({ length: maxTier + 1 }, (_, tier) =>
          Array.from({ length: 4 }, (_, col) => {
            const spell = tree.spells.find((s) => s.tierId === tier && s.columnIndex === col);
            if (!spell) {
              return <div key={`${tier}-${col}`} className="h-11 w-11" />;
            }

            const ranks = [spell.spellRank0, spell.spellRank1, spell.spellRank2, spell.spellRank3, spell.spellRank4].filter((r) => r > 0);
            let rank = 0;
            for (let i = 0; i < ranks.length; i++) {
              if (learnedSpells.has(ranks[i])) {
                rank = i + 1;
              }
            }
            const isLearned = rank > 0;
            const isMax = rank === ranks.length;

            return (
              <div key={spell.id} className="relative h-11 w-11">
                {spell.icon && (
                  <>
                    <img
                      src={`${ICON_BASE_URL}/${spell.icon.toLowerCase()}.jpg`}
                      alt=""
                      title={`${tree.name}天赋 (${rank}/${ranks.length})`}
                      className={`h-11 w-11 rounded border-2 ${isLearned ? (isMax ? 'border-yellow-500' : 'border-green-500') : 'border-gray-600 grayscale'}`}
                      loading="lazy"
                    />
                    {isLearned && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded bg-black px-1 text-[10px] text-white">
                        {rank}/{ranks.length}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function CharacterTalents({ data }: CharacterTalentsProps) {
  const [activeSpec, setActiveSpec] = useState(0);

  const hasSecondary = data.talents[1]?.length > 0;

  return (
    <div className="space-y-4">
      {hasSecondary && (
        <Tabs value={String(activeSpec)} onValueChange={(v) => setActiveSpec(Number(v))}>
          <TabsList className="mb-4">
            <TabsTrigger value="0">主天赋</TabsTrigger>
            <TabsTrigger value="1">副天赋</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.trees.map((tree) => {
          const learnedSpells = new Set(data.talents[activeSpec]);
          return <TalentTreeView key={tree.name} tree={tree} learnedSpells={learnedSpells} />;
        })}
      </div>

      {data.glyphs[activeSpec]?.length > 0 && (
        <div className="rounded-lg border bg-card p-3">
          <div className="mb-2 text-sm font-semibold">铭文</div>
          <div className="flex flex-wrap gap-2">
            {data.glyphs[activeSpec].map((glyphId, idx) => (
              <span key={idx} className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">
                铭文 {glyphId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
