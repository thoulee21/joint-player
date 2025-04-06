export interface Main {
  sgc: boolean;
  sfy: boolean;
  qfy: boolean;
  lrc: Klyric;
  klyric: Klyric;
  tlyric: Klyric;
  code: number;
}

export interface Klyric {
  version: number;
  lyric: string;
}
