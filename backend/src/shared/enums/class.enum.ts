export enum WowClass {
  WARRIOR = 1,
  PALADIN = 2,
  HUNTER = 3,
  ROGUE = 4,
  PRIEST = 5,
  DEATH_KNIGHT = 6,
  SHAMAN = 7,
  MAGE = 8,
  WARLOCK = 9,
  DRUID = 11,
  MONK = 10,
}

export const CLASS_NAMES: Record<number, string> = {
  [WowClass.WARRIOR]: '战士',
  [WowClass.PALADIN]: '圣骑士',
  [WowClass.HUNTER]: '猎人',
  [WowClass.ROGUE]: '潜行者',
  [WowClass.PRIEST]: '牧师',
  [WowClass.DEATH_KNIGHT]: '死亡骑士',
  [WowClass.SHAMAN]: '萨满祭司',
  [WowClass.MAGE]: '法师',
  [WowClass.WARLOCK]: '术士',
  [WowClass.DRUID]: '德鲁伊',
  [WowClass.MONK]: '武僧',
};

export const CLASS_COLORS: Record<number, string> = {
  [WowClass.WARRIOR]: '#c69b6d',
  [WowClass.PALADIN]: '#f48cba',
  [WowClass.HUNTER]: '#aad372',
  [WowClass.ROGUE]: '#fff468',
  [WowClass.PRIEST]: '#ffffff',
  [WowClass.DEATH_KNIGHT]: '#c41e3a',
  [WowClass.SHAMAN]: '#2359ff',
  [WowClass.MAGE]: '#68ccef',
  [WowClass.WARLOCK]: '#9382c9',
  [WowClass.DRUID]: '#ff7c0a',
  [WowClass.MONK]: '#00ff98',
};
