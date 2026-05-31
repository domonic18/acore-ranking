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
      <div className="grid gap-4 sm:gap-8" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
        {/* Left column - reverse layout for centered armory look */}
        <div className="space-y-2 pr-2 sm:pr-4">
          {leftSlots.map((slot) => (
            <ItemSlot key={slot} slot={slot} item={itemMap.get(slot)} reverse />
          ))}
        </div>

        {/* Center spacer */}
        <div className="w-4 sm:w-8" />

        {/* Right column */}
        <div className="space-y-2 pl-2 sm:pl-4">
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
