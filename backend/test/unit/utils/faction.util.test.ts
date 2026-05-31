import { getFactionByRace, Faction } from '../../../src/shared/utils/faction.util';

describe('getFactionByRace', () => {
  it('returns alliance for alliance races', () => {
    expect(getFactionByRace(1)).toBe(Faction.ALLIANCE);  // Human
    expect(getFactionByRace(3)).toBe(Faction.ALLIANCE);  // Dwarf
    expect(getFactionByRace(4)).toBe(Faction.ALLIANCE);  // NightElf
    expect(getFactionByRace(7)).toBe(Faction.ALLIANCE);  // Gnome
    expect(getFactionByRace(11)).toBe(Faction.ALLIANCE); // Draenei
  });

  it('returns horde for horde races', () => {
    expect(getFactionByRace(2)).toBe(Faction.HORDE);  // Orc
    expect(getFactionByRace(5)).toBe(Faction.HORDE);  // Undead
    expect(getFactionByRace(6)).toBe(Faction.HORDE);  // Tauren
    expect(getFactionByRace(8)).toBe(Faction.HORDE);  // Troll
    expect(getFactionByRace(10)).toBe(Faction.HORDE); // BloodElf
  });

  it('defaults to alliance for unknown races', () => {
    expect(getFactionByRace(99)).toBe(Faction.ALLIANCE);
    expect(getFactionByRace(-1)).toBe(Faction.ALLIANCE);
  });
});
