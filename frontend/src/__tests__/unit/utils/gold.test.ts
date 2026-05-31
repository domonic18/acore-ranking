import { describe, it, expect } from 'vitest';

function formatGold(copper: number): string {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold}金`);
  if (silver > 0) parts.push(`${silver}银`);
  if (c > 0) parts.push(`${c}铜`);
  return parts.length > 0 ? parts.join('') : '0';
}

describe('gold formatting', () => {
  it('formats zero copper', () => {
    expect(formatGold(0)).toBe('0');
  });

  it('formats copper only', () => {
    expect(formatGold(50)).toBe('50铜');
  });

  it('formats silver and copper', () => {
    expect(formatGold(1250)).toBe('12银50铜');
  });

  it('formats gold silver and copper', () => {
    expect(formatGold(1234567)).toBe('123金45银67铜');
  });

  it('formats gold only', () => {
    expect(formatGold(1000000)).toBe('100金');
  });
});
