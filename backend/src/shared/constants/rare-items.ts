export interface RareItemEntry {
  itemEntry: number;
  spellId?: number;
  name?: string;
}

export const RARE_ITEM_ENTRIES: RareItemEntry[] = [
  // 黑色其拉共鸣水晶：item_template.spellid_2 = 26656 为学习后的坐骑技能
  { itemEntry: 21176, spellId: 26656 },
] as const;
