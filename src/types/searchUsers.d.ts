export interface Main {
  result: Result;
  code: number;
  message: string;
}

export interface Result {
  userprofiles: Userprofile[];
  userprofileCount: number;
}

export interface Userprofile {
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
  expertTags: null;
  experts: null;
  djStatus: number;
  vipType: number;
  remarkName: null;
  authenticationTypes: number;
  avatarDetail: null;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
  anchor: boolean;
  avatarImgId_str: string;
  followeds: number;
  follows: number;
  alg: Alg;
  playlistCount: number;
  playlistBeSubscribedCount: number;
}

export enum Alg {
  AlgUserBasic = "alg_user_basic",
}
