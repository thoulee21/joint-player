export interface Main {
    loadingPic:   string;
    bufferPic:    string;
    loadingPicFS: string;
    bufferPicFS:  string;
    subed:        boolean;
    data:         Data;
    code:         number;
}

export interface Data {
    id:              number;
    name:            string;
    artistId:        number;
    artistName:      string;
    briefDesc:       string;
    desc:            null;
    cover:           string;
    coverId:         number;
    playCount:       number;
    subCount:        number;
    shareCount:      number;
    likeCount:       number;
    commentCount:    number;
    duration:        number;
    nType:           number;
    publishTime:     Date;
    brs:             BRS;
    artists:         Artist[];
    isReward:        boolean;
    commentThreadId: string;
}

export interface Artist {
    id:   number;
    name: string;
}

export interface BRS {
    '240': string;
}
