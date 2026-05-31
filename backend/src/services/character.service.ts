import { CacheService, CacheTTL } from './cache.service';
import { CharacterRepository } from '../repositories/character.repository';
import { getFactionByRace } from '../shared/utils/faction.util';
import { formatTotalTime } from '../shared/utils/time.util';
import { ITEM_DISPLAY_INFO } from '../generated/itemDisplayInfo';
import { SPELL_ICON } from '../generated/spellIcon';
import { SPELL_TO_ICON } from '../generated/spellToIcon';
import { TALENT_TABS, TALENTS } from '../generated/talents';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from '../generated/achievements';

export class CharacterService {
  private cache = new CacheService();
  private repo = new CharacterRepository();

  async getCharacterInfo(name: string): Promise<unknown | null> {
    const cacheKey = `character:info:${name}`;
    const cached = await this.cache.get<unknown>(cacheKey);
    if (cached) return cached;

    const char = await this.repo.findByName(name) as any;
    if (!char) return null;

    const questCount = await this.repo.countQuests(char.guid);
    const achieveCount = await this.repo.countAchievements(char.guid);

    const result = {
      guid: char.guid,
      name: char.name,
      level: char.level,
      race: char.race,
      class: char.class,
      gender: char.gender,
      health: char.health,
      side: getFactionByRace(char.race),
      total_time: char.totaltime,
      total_time_str: formatTotalTime(char.totaltime),
      total_honor_points: char.totalHonorPoints,
      arena_points: char.arenaPoints,
      total_kills: char.totalKills,
      quest_count: questCount,
      achievement_count: achieveCount,
      guild: char.guild_name || null,
      creation_date: char.creation_date,
      last_login: char.logout_time
        ? new Date(char.logout_time * 1000).toISOString()
        : null,
    };

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getCharacterItems(name: string): Promise<unknown[]> {
    const cacheKey = `character:items:${name}`;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const items = await this.repo.findInventory(name) as any[];
    const result = items.map((item) => ({
      item_guid: item.item,
      slot: item.slot,
      item_entry: item.itemEntry,
      display_id: item.displayid,
      name: item.item_name,
      quality: item.Quality,
      icon: ITEM_DISPLAY_INFO[item.displayid] || null,
    }));

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getCharacterTalents(name: string): Promise<unknown | null> {
    const cacheKey = `character:talents:${name}`;
    const cached = await this.cache.get<unknown>(cacheKey);
    if (cached) return cached;

    const char = await this.repo.findByName(name) as any;
    if (!char) return null;

    const dbTalents = await this.repo.findTalents(char.guid);
    const dbGlyphs = await this.repo.findGlyphs(char.guid);

    const classMask = 1 << (char.class - 1);
    const tabs = TALENT_TABS.filter((t) => t.classMask === classMask);

    const specs: number[][] = [[], []];
    for (const row of dbTalents) {
      if (row.specMask === 1 || row.specMask === 3) specs[0].push(row.spell);
      if (row.specMask === 2 || row.specMask === 3) specs[1].push(row.spell);
    }

    const trees = tabs.map((tab) => {
      const spells = TALENTS.filter((t) => t.tabId === tab.id).map((t) => {
        const ranks = [t.spellRank0, t.spellRank1, t.spellRank2, t.spellRank3, t.spellRank4];
        const firstSpellId = ranks.find((id) => id > 0);
        const spellIconId = firstSpellId ? SPELL_TO_ICON[firstSpellId] : undefined;
        return {
          id: t.id,
          tierId: t.tierId,
          columnIndex: t.columnIndex,
          spellRank0: t.spellRank0,
          spellRank1: t.spellRank1,
          spellRank2: t.spellRank2,
          spellRank3: t.spellRank3,
          spellRank4: t.spellRank4,
          prereqTalent0: t.prereqTalent0,
          icon: spellIconId ? SPELL_ICON[spellIconId] || null : null,
        };
      });
      return {
        name: tab.name,
        iconId: tab.iconId,
        icon: SPELL_ICON[tab.iconId] || null,
        spells,
      };
    });

    const glyphs: number[][] = [[], []];
    for (const row of dbGlyphs) {
      const ids = [row.glyph1, row.glyph2, row.glyph3, row.glyph4, row.glyph5, row.glyph6].filter((id: number) => id !== 0);
      if (row.talentGroup >= 0 && row.talentGroup < 2) {
        glyphs[row.talentGroup].push(...ids);
      }
    }

    const result = {
      trees,
      talents: specs,
      glyphs,
    };

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }

  async getCharacterAchievements(name: string): Promise<unknown | null> {
    const cacheKey = `character:achievements:${name}`;
    const cached = await this.cache.get<unknown>(cacheKey);
    if (cached) return cached;

    const char = await this.repo.findByName(name) as any;
    if (!char) return null;

    const earnedRows = await this.repo.findAchievements(char.guid);
    const earned: Record<number, number> = {};
    for (const row of earnedRows) {
      earned[row.achievement] = row.date;
    }

    const [achLocales, catLocales] = await Promise.all([
      this.repo.findAchievementLocales().catch(() => [] as { id: number; titleZh: string | null; descriptionZh: string | null }[]),
      this.repo.findAchievementCategoryLocales().catch(() => [] as { id: number; nameZh: string | null }[]),
    ]);

    const achLocaleMap = new Map<number, { titleZh: string | null; descriptionZh: string | null }>();
    for (const loc of achLocales) {
      achLocaleMap.set(loc.id, { titleZh: loc.titleZh, descriptionZh: loc.descriptionZh });
    }

    const catLocaleMap = new Map<number, string | null>();
    for (const loc of catLocales) {
      catLocaleMap.set(loc.id, loc.nameZh);
    }

    const faction = getFactionByRace(char.race);
    const achievements = ACHIEVEMENTS
      .filter((a) => a.faction === -1 || a.faction === faction)
      .map((a) => {
        const loc = achLocaleMap.get(a.id);
        return {
          id: a.id,
          category: a.category,
          title: loc?.titleZh || (a as any).titleZh || a.title,
          description: loc?.descriptionZh || (a as any).descriptionZh || a.description,
          points: a.points,
          icon: SPELL_ICON[a.iconId] || null,
        };
      });

    const categories = ACHIEVEMENT_CATEGORIES.map((c) => ({
      id: c.id,
      parent: c.parent,
      name: catLocaleMap.get(c.id) || (c as any).nameZh || c.name,
    }));

    let totalPoints = 0;
    for (const ach of achievements) {
      if (earned[ach.id]) {
        totalPoints += ach.points;
      }
    }

    const result = {
      achievements,
      categories,
      earned,
      totalPoints,
    };

    await this.cache.set(cacheKey, result, CacheTTL.short);
    return result;
  }
}
