export interface Main {
    artist:    Artist;
    hotAlbums: HotAlbum[];
    more:      boolean;
    code:      number;
}

export interface Artist {
    img1v1Id:     number;
    topicPerson:  number;
    picId:        number;
    briefDesc:    string;
    musicSize:    number;
    albumSize:    number;
    picUrl:       string;
    img1v1Url:    string;
    followed:     boolean;
    trans:        string;
    alias:        any[];
    name:         Name;
    id:           number;
    picId_str?:   string;
    img1v1Id_str: string;
}

export enum Name {
    MattMaeson = "Matt Maeson",
    Steinza = "Steinza",
}

export interface HotAlbum {
    songs:           any[];
    paid:            boolean;
    onSale:          boolean;
    mark:            number;
    awardTags:       null;
    artists:         Artist[];
    copyrightId:     number;
    picId:           number;
    artist:          Artist;
    company:         Company;
    briefDesc:       string;
    publishTime:     number;
    picUrl:          string;
    commentThreadId: string;
    blurPicUrl:      string;
    companyId:       number;
    pic:             number;
    status:          number;
    subType:         SubType;
    alias:           any[];
    description:     string;
    tags:            string;
    name:            string;
    id:              number;
    type:            Type;
    size:            number;
    picId_str:       string;
}

export enum Company {
    BoomRecords = "Boom.Records",
    华纳音乐 = "华纳音乐",
}

export enum SubType {
    Remix = "Remix",
    录音室版 = "录音室版",
    现场版 = "现场版",
}

export enum Type {
    Single = "Single",
    专辑 = "专辑",
}
