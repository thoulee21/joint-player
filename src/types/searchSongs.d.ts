export interface Main {
    result: Result;
    code:   number;
}

export interface Result {
    songs:     Song[];
    songCount: number;
}

export interface Song {
    id:          number;
    name:        string;
    artists:     Artist[];
    album:       Album;
    duration:    number;
    copyrightId: number;
    status:      number;
    alias:       string[];
    rtype:       number;
    ftype:       number;
    mvid:        number;
    fee:         number;
    rUrl:        null;
    mark:        number;
}

export interface Album {
    id:          number;
    name:        string;
    artist:      Artist;
    publishTime: number;
    size:        number;
    copyrightId: number;
    status:      number;
    picId:       number;
    mark:        number;
}

export interface Artist {
    id:        number;
    name:      string;
    picUrl:    null;
    alias:     any[];
    albumSize: number;
    picId:     number;
    fansGroup: null;
    img1v1Url: string;
    img1v1:    number;
    trans:     null;
}
