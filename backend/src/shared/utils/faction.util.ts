import { Faction } from '../enums/faction.enum';
export { Faction };

// Alliance races: Human(1), Dwarf(3), NightElf(4), Gnome(7), Draenei(11)
// Horde races: Orc(2), Undead(5), Tauren(6), Troll(8), BloodElf(10)
const ALLIANCE_RACES = new Set([1, 3, 4, 7, 11]);
const HORDE_RACES = new Set([2, 5, 6, 8, 10]);

export function getFactionByRace(race: number): Faction {
  if (ALLIANCE_RACES.has(race)) return Faction.ALLIANCE;
  if (HORDE_RACES.has(race)) return Faction.HORDE;
  return Faction.ALLIANCE; // default
}
