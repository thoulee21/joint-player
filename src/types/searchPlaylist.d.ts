export interface Main {
  result: Result;
  code: number;
}

export interface Result {
  playlists: Playlist[];
  playlistCount: number;
}

export interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  creator: Creator;
  subscribed: boolean;
  trackCount: number;
  userId: number;
  playCount: number;
  bookCount: number;
  specialType: number;
  officialTags: null;
  action: null;
  actionType: null;
  recommendText: null;
  score: null;
  description: null | string;
  highQuality: boolean;
}

export interface Creator {
  nickname: string;
  userId: number;
  userType: number;
  avatarUrl: null;
  authStatus: number;
  expertTags: null;
  experts: null;
}
