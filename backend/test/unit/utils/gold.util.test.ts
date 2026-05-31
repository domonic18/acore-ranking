import { formatGold, copperToGold } from '../../../src/shared/utils/gold.util';

describe('formatGold', () => {
  it('formats copper to gold/silver/copper string', () => {
    expect(formatGold(0)).toBe('0金0银0铜');
    expect(formatGold(1)).toBe('0金0银1铜');
    expect(formatGold(100)).toBe('0金1银0铜');
    expect(formatGold(10000)).toBe('1金0银0铜');
    expect(formatGold(12345678)).toBe('1234金56银78铜');
  });
});

describe('copperToGold', () => {
  it('converts copper to gold float', () => {
    expect(copperToGold(0)).toBe(0);
    expect(copperToGold(10000)).toBe(1);
    expect(copperToGold(12345678)).toBe(1234.5678);
  });
});
