export interface RareItemEntry {
  itemEntry: number;
  spellId?: number;
  name?: string;
}

export const RARE_ITEM_ENTRIES: RareItemEntry[] = [
  { itemEntry: 21176, spellId: 26655 }, // 黑色其拉共鸣水晶
] as const;
