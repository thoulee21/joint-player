export interface Main {
  result: Result;
  code: number;
  msg: string;
  message: string;
}

export interface Result {
  subscribers: any[];
  subscribed: boolean;
  creator: Creator;
  artists: null;
  tracks: Track[];
  updateFrequency: null;
  backgroundCoverId: number;
  backgroundCoverUrl: null;
  titleImage: number;
  coverText: null;
  titleImageUrl: null;
  coverImageUrl: null;
  iconImageUrl: null;
  englishTitle: null;
  opRecommend: boolean;
  recommendInfo: null;
  socialPlaylistCover: null;
  tsSongCount: number;
  playCount: number;
  trackNumberUpdateTime: number;
  trackUpdateTime: number;
  privacy: number;
  highQuality: boolean;
  specialType: number;
  anonimous: boolean;
  coverImgId: number;
  updateTime: number;
  newImported: boolean;
  coverImgUrl: string;
  trackCount: number;
  commentThreadId: string;
  totalDuration: number;
  adType: number;
  cloudTrackCount: number;
  subscribedCount: number;
  createTime: number;
  ordered: boolean;
  description: string;
  status: number;
  tags: string[];
  userId: number;
  name: string;
  id: number;
  shareCount: number;
  commentCount: number;
}

export interface Creator {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags: string[];
  experts: Experts;
  djStatus: number;
  vipType: number;
  remarkName: null;
  authenticationTypes: number;
  avatarDetail: null;
  backgroundImgIdStr: string;
  avatarImgIdStr: string;
  anchor: boolean;
}

export interface Experts {
  "2": string;
}

export interface Track {
  name: string;
  id: number;
  position: number;
  alias: string[];
  status: number;
  fee: number;
  copyrightId: number;
  disc: string;
  no: number;
  artists: Artist[];
  album: Album;
  starred: boolean;
  popularity: number;
  score: number;
  starredNum: number;
  duration: number;
  playedNum: number;
  dayPlays: number;
  hearTime: number;
  sqMusic: Music | null;
  hrMusic: Music | null;
  ringtone: Ringtone;
  crbt: null;
  audition: null;
  copyFrom: string;
  commentThreadId: string;
  rtUrl: null;
  ftype: number;
  rtUrls: any[];
  copyright: number;
  transName: null | string;
  sign: null;
  mark: number;
  originCoverType: number;
  originSongSimpleData: null;
  single: number;
  noCopyrightRcmd: null;
  hMusic: Music;
  mMusic: Music;
  lMusic: Music;
  bMusic: Music;
  mp3Url: null;
  rtype: number;
  rurl: null;
  mvid: number;
  transNames?: string[];
}

export interface Album {
  name: string;
  id: number;
  type: Type;
  size: number;
  picId: number;
  blurPicUrl: string;
  companyId: number;
  pic: number;
  picUrl: string;
  publishTime: number;
  description: string;
  tags: string;
  company: string;
  briefDesc: string;
  artist: Artist;
  songs: any[];
  alias: string[];
  status: number;
  copyrightId: number;
  commentThreadId: string;
  artists: Artist[];
  subType: SubType;
  transName: null | string;
  onSale: boolean;
  mark: number;
  gapless: number;
  dolbyMark: number;
  picId_str?: string;
  transNames?: string[];
}

export interface Artist {
  name: string;
  id: number;
  picId: number;
  img1v1Id: number;
  briefDesc: string;
  picUrl: string;
  img1v1Url: string;
  albumSize: number;
  alias: any[];
  trans: string;
  musicSize: number;
  topicPerson: number;
}

export enum SubType {
  录音室版 = "录音室版",
}

export enum Type {
  专辑 = "专辑",
}

export interface Music {
  name: null;
  id: number;
  size: number;
  extension: Extension;
  sr: number;
  dfsId: number;
  bitrate: number;
  playTime: number;
  volumeDelta: number;
}

export enum Extension {
  FLAC = "flac",
  Mp3 = "mp3",
}

export enum Ringtone {
  Empty = "",
  The600902000002751642 = "600902000002751642",
  The600902000005339510 = "600902000005339510",
}
