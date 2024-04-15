export interface Main {
    isMusician:  boolean;
    userId:      number;
    topComments: any[];
    code:        number;
    comments:    Comment[];
    total:       number;
    more:        boolean;
}

export interface Comment {
    user:                User;
    beReplied:           BeReplied[];
    pendantData:         PendantData | null;
    showFloorComment:    null;
    status:              number;
    commentId:           number;
    content:             string;
    richContent:         null | string;
    contentResource:     null;
    time:                number;
    timeStr:             string;
    needDisplayTime:     boolean;
    likedCount:          number;
    expressionUrl:       null;
    commentLocationType: number;
    parentCommentId:     number;
    decoration:          Decoration;
    repliedMark:         null;
    grade:               null;
    userBizLevels:       null;
    ipLocation:          IPLocation;
    owner:               boolean;
    medal:               null;
    liked:               boolean;
}

export interface BeReplied {
    user:               User;
    beRepliedCommentId: number;
    content:            string;
    richContent:        null | string;
    status:             number;
    expressionUrl:      null;
    ipLocation:         IPLocation;
}

export interface IPLocation {
    ip:       null;
    location: string;
    userId:   number;
}

export interface User {
    locationInfo:   null;
    liveInfo:       null;
    anonym:         number;
    commonIdentity: null;
    userType:       number;
    avatarDetail:   null;
    avatarUrl:      string;
    followed:       boolean;
    mutual:         boolean;
    remarkName:     null;
    socialUserId:   null;
    vipRights:      VipRights | null;
    nickname:       string;
    authStatus:     number;
    expertTags:     null;
    experts:        null;
    vipType:        number;
    userId:         number;
    target:         null;
}

export interface VipRights {
    associator:        Associator | null;
    musicPackage:      Associator | null;
    redplus:           Associator | null;
    redVipAnnualCount: number;
    redVipLevel:       number;
    relationType:      number;
}

export interface Associator {
    vipCode: number;
    rights:  boolean;
    iconUrl: string;
}

export interface Decoration {
}

export interface PendantData {
    id:       number;
    imageUrl: string;
}
