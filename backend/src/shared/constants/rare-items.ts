export interface RareItemEntry {
  itemEntry: number;
  name?: string;
}

export const RARE_ITEM_ENTRIES: RareItemEntry[] = [
  { itemEntry: 21176 }, // 黑色其拉共鸣水晶
] as const;
