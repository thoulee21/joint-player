export interface Main {
    msg:        string;
    songs:      Song[];
    equalizers: Equalizers;
    code:       number;
}

export interface Equalizers {
}

export interface Song {
    name:                 string;
    id:                   number;
    position:             number;
    alias:                any[];
    status:               number;
    fee:                  number;
    copyrightId:          number;
    disc:                 string;
    no:                   number;
    artists:              Artist[];
    album:                Album;
    starred:              boolean;
    popularity:           number;
    score:                number;
    starredNum:           number;
    duration:             number;
    playedNum:            number;
    dayPlays:             number;
    hearTime:             number;
    sqMusic:              Music;
    hrMusic:              Music;
    ringtone:             string;
    crbt:                 null;
    audition:             null;
    copyFrom:             string;
    commentThreadId:      string;
    rtUrl:                null;
    ftype:                number;
    rtUrls:               any[];
    copyright:            number;
    transName:            null;
    sign:                 null;
    mark:                 number;
    originCoverType:      number;
    originSongSimpleData: null;
    single:               number;
    noCopyrightRcmd:      null;
    hMusic:               Music;
    mMusic:               Music;
    lMusic:               Music;
    bMusic:               Music;
    mvid:                 number;
    rtype:                number;
    rurl:                 null;
    mp3Url:               null;
}

export interface Album {
    name:            string;
    id:              number;
    type:            string;
    size:            number;
    picId:           number;
    blurPicUrl:      string;
    companyId:       number;
    pic:             number;
    picUrl:          string;
    publishTime:     number;
    description:     string;
    tags:            string;
    company:         string;
    briefDesc:       string;
    artist:          Artist;
    songs:           any[];
    alias:           any[];
    status:          number;
    copyrightId:     number;
    commentThreadId: string;
    artists:         Artist[];
    subType:         string;
    transName:       null;
    onSale:          boolean;
    mark:            number;
    gapless:         number;
    dolbyMark:       number;
    picId_str:       string;
}

export interface Artist {
    name:        string;
    id:          number;
    picId:       number;
    img1v1Id:    number;
    briefDesc:   string;
    picUrl:      string;
    img1v1Url:   string;
    albumSize:   number;
    alias:       any[];
    trans:       string;
    musicSize:   number;
    topicPerson: number;
}

export interface Music {
    name:        null;
    id:          number;
    size:        number;
    extension:   string;
    sr:          number;
    dfsId:       number;
    bitrate:     number;
    playTime:    number;
    volumeDelta: number;
}
