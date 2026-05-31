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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr]">
        {/* Left column - reverse layout for centered armory look */}
        <div className="space-y-2 md:pr-4">
          {leftSlots.map((slot) => (
            <ItemSlot key={slot} slot={slot} item={itemMap.get(slot)} reverse />
          ))}
        </div>

        {/* Center spacer */}
        <div className="hidden md:block w-8" />

        {/* Right column */}
        <div className="space-y-2 md:pl-4">
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
