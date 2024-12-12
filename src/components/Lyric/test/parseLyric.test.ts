import type { LyricLine } from '../lyric';
import { parseLyric } from '../util/parseLyric';

describe('parseLyric', () => {
  it('parses lyrics correctly', () => {
    const lrc = `[00:12.00]Line 1
[00:17.20]Line 2
[00:21.10]Line 3`;
    const expected: LyricLine[] = [
      { millisecond: 12000, content: 'Line 1' },
      { millisecond: 17020, content: 'Line 2' },
      { millisecond: 21010, content: 'Line 3' },
    ];
    expect(parseLyric(lrc)).toEqual(expected);
  });

  it('handles multiple timestamps for the same line', () => {
    const lrc = `[00:12.00][00:15.00]Line 1
[00:17.20]Line 2`;
    const expected: LyricLine[] = [
      { millisecond: 12000, content: 'Line 1' },
      { millisecond: 15000, content: 'Line 1' },
      { millisecond: 17020, content: 'Line 2' },
    ];
    expect(parseLyric(lrc)).toEqual(expected);
  });

  it('ignores lines without timestamps', () => {
    const lrc = `Line without timestamp
[00:12.00]Line 1`;
    const expected: LyricLine[] = [
      { millisecond: 12000, content: 'Line 1' },
    ];
    expect(parseLyric(lrc)).toEqual(expected);
  });

  it('sorts lines by timestamp', () => {
    const lrc = `[00:17.20]Line 2
[00:12.00]Line 1`;
    const expected: LyricLine[] = [
      { millisecond: 12000, content: 'Line 1' },
      { millisecond: 17020, content: 'Line 2' },
    ];
    expect(parseLyric(lrc)).toEqual(expected);
  });
});
