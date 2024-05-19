export interface Main {
    level:                    number;
    listenSongs:              number;
    userPoint:                UserPoint;
    mobileSign:               boolean;
    pcSign:                   boolean;
    profile:                  Profile;
    peopleCanSeeMyPlayRecord: boolean;
    bindings:                 any[];
    adValid:                  boolean;
    code:                     number;
    newUser:                  boolean;
    recallUser:               boolean;
    createTime:               number;
    createDays:               number;
    profileVillageInfo:       ProfileVillageInfo;
}

export interface Profile {
    privacyItemUnlimit:        PrivacyItemUnlimit;
    avatarDetail:              null;
    nickname:                  string;
    birthday:                  number;
    gender:                    number;
    province:                  number;
    city:                      number;
    vipType:                   number;
    detailDescription:         string;
    userType:                  number;
    followed:                  boolean;
    djStatus:                  number;
    accountStatus:             number;
    defaultAvatar:             boolean;
    avatarImgId:               number;
    backgroundImgId:           number;
    mutual:                    boolean;
    backgroundUrl:             string;
    avatarUrl:                 string;
    authStatus:                number;
    expertTags:                null;
    remarkName:                null;
    experts:                   Experts;
    createTime:                number;
    avatarImgIdStr:            string;
    backgroundImgIdStr:        string;
    description:               string;
    userId:                    number;
    signature:                 string;
    authority:                 number;
    followeds:                 number;
    follows:                   number;
    blacklist:                 boolean;
    eventCount:                number;
    allSubscribedCount:        number;
    playlistBeSubscribedCount: number;
    avatarImgId_str:           string;
    followTime:                null;
    followMe:                  boolean;
    artistIdentity:            any[];
    cCount:                    number;
    inBlacklist:               boolean;
    sDJPCount:                 number;
    playlistCount:             number;
    sCount:                    number;
    newFollows:                number;
}

export interface Experts {
}

export interface PrivacyItemUnlimit {
    area:       boolean;
    college:    boolean;
    gender:     boolean;
    age:        boolean;
    villageAge: boolean;
}

export interface ProfileVillageInfo {
    title:     string;
    imageUrl:  null;
    targetUrl: string;
}

export interface UserPoint {
    userId:       number;
    balance:      number;
    updateTime:   number;
    version:      number;
    status:       number;
    blockBalance: number;
}
