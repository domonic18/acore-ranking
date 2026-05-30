import { Card, CardContent } from '@/shared/components/ui/card';
import { QUALITY_COLORS } from '@/shared/constants/game';
import type { CharacterItem } from '../types';

const slotNames: Record<number, string> = {
  0: '头部', 1: '颈部', 2: '肩部', 3: '衬衫', 4: '胸甲',
  5: '腰带', 6: '腿部', 7: '靴子', 8: '护腕', 9: '手套',
  10: '戒指', 11: '戒指', 12: '饰品', 13: '饰品',
  14: '背部', 15: '主手', 16: '副手', 17: '远程', 18: '战袍',
};

interface CharacterEquipmentProps {
  items: CharacterItem[];
}

export function CharacterEquipment({ items }: CharacterEquipmentProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.item_guid}>
          <CardContent className="flex items-center gap-3 p-3">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
