import type { CharacterItem } from '../types';
import { ItemSlot } from './ItemSlot';

const leftSlots = [0, 1, 2, 14, 4, 3, 18, 8];
const rightSlots = [9, 5, 6, 7, 10, 11, 12, 13];
const bottomSlots = [15, 16, 17];

interface CharacterEquipmentProps {
  items: CharacterItem[];
}

export function CharacterEquipment({ items }: CharacterEquipmentProps) {
  const itemMap = new Map(items.map((item) => [item.slot, item]));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-2">
          {leftSlots.map((slot) => (
            <ItemSlot key={slot} slot={slot} item={itemMap.get(slot)} />
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {rightSlots.map((slot) => (
            <ItemSlot key={slot} slot={slot} item={itemMap.get(slot)} />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-wrap justify-center gap-4">
        {bottomSlots.map((slot) => (
          <ItemSlot key={slot} slot={slot} item={itemMap.get(slot)} />
        ))}
      </div>
    </div>
  );
}
