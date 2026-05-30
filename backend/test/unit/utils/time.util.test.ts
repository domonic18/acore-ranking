import { formatTotalTime } from '../../../src/shared/utils/time.util';

describe('formatTotalTime', () => {
  it('formats seconds to days, hours, minutes', () => {
    expect(formatTotalTime(0)).toBe('0 天 0 小时 0 分钟');
    expect(formatTotalTime(60)).toBe('0 天 0 小时 1 分钟');
    expect(formatTotalTime(3600)).toBe('0 天 1 小时 0 分钟');
    expect(formatTotalTime(86400)).toBe('1 天 0 小时 0 分钟');
    expect(formatTotalTime(90061)).toBe('1 天 1 小时 1 分钟');
  });

  it('handles large values', () => {
    expect(formatTotalTime(86400 * 10 + 3600 * 5 + 60 * 30)).toBe('10 天 5 小时 30 分钟');
  });
});
