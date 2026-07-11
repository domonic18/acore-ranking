import { formatDeathReason } from '../../../src/shared/utils/death-reason.util';

describe('formatDeathReason', () => {
  it('returns null for empty or legacy placeholder values', () => {
    expect(formatDeathReason(null, null)).toBeNull();
    expect(formatDeathReason(undefined, null)).toBeNull();
    expect(formatDeathReason('death', null)).toBeNull();
    expect(formatDeathReason('', null)).toBeNull();
  });

  it('maps built-in reasons to Chinese display text', () => {
    expect(formatDeathReason('resurrect', null)).toBe('被复活');
    expect(formatDeathReason('environmental', null)).toBe('非正常死亡');
  });

  it('formats player kill with name and level', () => {
    expect(formatDeathReason('player', 'player:Thrall:level60:class7')).toBe('被玩家 Thrall (等级 60) 击杀');
  });

  it('falls back for player kill without killer info', () => {
    expect(formatDeathReason('player', null)).toBe('被玩家击杀');
  });

  it('formats creature kill with name and level', () => {
    expect(formatDeathReason('creature', 'creature:686:Lashtail Raptor:level35')).toBe('被怪物 Lashtail Raptor (等级 35) 击杀');
  });

  it('falls back for creature kill without killer info', () => {
    expect(formatDeathReason('creature', null)).toBe('被怪物击杀');
  });

  it('returns unknown reasons as-is', () => {
    expect(formatDeathReason('fall', null)).toBe('fall');
  });
});
