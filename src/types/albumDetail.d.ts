export interface Main {
  code: number;
  album: MainAlbum;
}

export interface MainAlbum {
  songs: Song[];
  paid: boolean;
  onSale: boolean;
  mark: number;
  awardTags: null;
  blurPicUrl: string;
  companyId: number;
  pic: number;
  artists: Artist[];
  copyrightId: number;
  picId: number;
  artist: Artist;
  publishTime: number;
  company: string;
  briefDesc: string;
  picUrl: string;
  commentThreadId: string;
  status: number;
  subType: string;
  description: string;
  tags: string;
  alias: any[];
  name: string;
  id: number;
  type: string;
  size: number;
  picId_str: string;
  info: Info;
}

export interface Artist {
  img1v1Id: number;
  topicPerson: number;
  followed: boolean;
  trans: string;
  picId: number;
  briefDesc: string;
  musicSize: number;
  albumSize: number;
  picUrl: string;
  img1v1Url: string;
  alias: string[];
  name: string;
  id: number;
  picId_str?: string;
  img1v1Id_str: string;
}

export interface Info {
  commentThread: CommentThread;
  latestLikedUsers: null;
  liked: boolean;
  comments: null;
  resourceType: number;
  resourceId: number;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  threadId: string;
}

export interface CommentThread {
  id: string;
  resourceInfo: ResourceInfo;
  resourceType: number;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  hotCount: number;
  latestLikedUsers: null;
  resourceOwnerId: number;
  resourceTitle: string;
  resourceId: number;
}

export interface ResourceInfo {
  id: number;
  userId: number;
  name: string;
  imgUrl: string;
  creator: null;
  encodedId: null;
  subTitle: null;
  webUrl: null;
}

export interface Song {
  starred: boolean;
  popularity: number;
  starredNum: number;
  playedNum: number;
  dayPlays: number;
  hearTime: number;
  mp3Url: string;
  rtUrls: null;
  mark: number;
  noCopyrightRcmd: null;
  originCoverType: number;
  originSongSimpleData: null;
  songJumpInfo: null;
  bMusic: Music;
  sqMusic: Music;
  hrMusic: null;
  artists: Artist[];
  copyrightId: number;
  album: SongAlbum;
  score: number;
  no: number;
  fee: number;
  disc: string;
  hMusic: Music;
  mMusic: Music;
  lMusic: Music;
  audition: null;
  copyFrom: string;
  ringtone: string;
  commentThreadId: string;
  mvid: number;
  crbt: null;
  rtUrl: null;
  ftype: number;
  rtype: number;
  rurl: null;
  position: number;
  duration: number;
  status: number;
  alias: string[];
  name: string;
  id: number;
}

export interface SongAlbum {
  songs: any[];
  paid: boolean;
  onSale: boolean;
  mark: number;
  awardTags: null;
  blurPicUrl: string;
  companyId: number;
  pic: number;
  artists: Artist[];
  copyrightId: number;
  picId: number;
  artist: Artist;
  publishTime: number;
  company: string;
  briefDesc: string;
  picUrl: string;
  commentThreadId: string;
  status: number;
  subType: string;
  description: string;
  tags: string;
  alias: any[];
  name: string;
  id: number;
  type: string;
  size: number;
  picId_str: string;
}

export interface Music {
  volumeDelta: number;
  bitrate: number;
  playTime: number;
  dfsId: number;
  sr: number;
  name: string;
  id: number;
  size: number;
  extension: string;
}
