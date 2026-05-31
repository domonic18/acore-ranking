import { QUALITY_COLORS } from '@/shared/constants/game';
import type { CharacterItem } from '../types';

const slotNames: Record<number, string> = {
  0: '头部', 1: '颈部', 2: '肩部', 3: '衬衫', 4: '胸甲',
  5: '腰带', 6: '腿部', 7: '靴子', 8: '护腕', 9: '手套',
  10: '戒指', 11: '戒指', 12: '饰品', 13: '饰品',
  14: '背部', 15: '主手', 16: '副手', 17: '远程', 18: '战袍',
};

const WOWHEAD_ICON_BASE = 'https://wow.zamimg.com/images/wow/icons/medium';

interface ItemSlotProps {
  slot: number;
  item?: CharacterItem;
}

export function ItemSlot({ slot, item }: ItemSlotProps) {
  const qualityColor = item ? (QUALITY_COLORS[item.quality] ?? '#fff') : undefined;
  const iconUrl = item?.icon ? `${WOWHEAD_ICON_BASE}/${item.icon.toLowerCase()}.jpg` : null;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 bg-secondary/50 ${item ? '' : 'border-muted'}`}
        style={item ? { borderColor: qualityColor } : undefined}
        title={item ? `${slotNames[slot]} - ${item.name}` : slotNames[slot]}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={item!.name}
            className="h-10 w-10 rounded"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="text-[10px] text-muted-foreground">{slotNames[slot]}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {item ? (
          <>
            <div
              className="truncate text-sm font-medium"
              style={{ color: qualityColor }}
            >
              {item.name}
            </div>
            <div className="text-xs text-muted-foreground">
              物品等级 {item.item_entry}
            </div>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}
