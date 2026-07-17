export interface RareItemEntry {
  itemEntry: number;
  spellId?: number;
  name?: string;
}

export const RARE_ITEM_ENTRIES: RareItemEntry[] = [
  // 黑色其拉共鸣水晶：item_template.spellid_2 = 26656 为学习后的坐骑技能
  { itemEntry: 21176, spellId: 26656 },
  // 瑞文戴尔的死亡战马
  { itemEntry: 13335, spellId: 17481 },
  // 奥的灰烬
  { itemEntry: 32458, spellId: 40192 },
  // 提布的炽炎长剑（装备，只统计背包）
  { itemEntry: 1728 },
  // 银色侍从的马缰绳（使用型物品，只统计背包）
  { itemEntry: 47541 },
] as const;
