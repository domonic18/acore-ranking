import { describe, it, expect } from 'vitest';

function getFactionByRace(race: number): number {
  const allianceRaces = [1, 3, 4, 7, 11];
  return allianceRaces.includes(race) ? 0 : 1;
}

describe('faction detection', () => {
  it('detects alliance races', () => {
    expect(getFactionByRace(1)).toBe(0); // 人类
    expect(getFactionByRace(3)).toBe(0); // 矮人
    expect(getFactionByRace(4)).toBe(0); // 暗夜精灵
    expect(getFactionByRace(7)).toBe(0); // 侏儒
    expect(getFactionByRace(11)).toBe(0); // 德莱尼
  });

  it('detects horde races', () => {
    expect(getFactionByRace(2)).toBe(1); // 兽人
    expect(getFactionByRace(5)).toBe(1); // 亡灵
    expect(getFactionByRace(6)).toBe(1); // 牛头人
    expect(getFactionByRace(8)).toBe(1); // 巨魔
    expect(getFactionByRace(10)).toBe(1); // 血精灵
  });
});
