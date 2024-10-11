import { ToastAndroid } from 'react-native';
import { fetchPlus } from './fetchPlus';
import { requestInit } from './requestInit';

export const fetchSearchResults = async (keyword: string): Promise<any> => {
    const { Type, Limit, Offset, Total } = {
        Type: 1,
        Limit: 20,
        Offset: 0,
        Total: true,
    };

    const fetchResult = await fetchPlus(
        `https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=${Type}&offset=${Offset}&total=${Total}&limit=${Limit}`,
        requestInit,
    );
    const { result } = await fetchResult.json();

    if (fetchResult.status !== 200) {
        ToastAndroid.show(
            `Failed to fetch search results: ${fetchResult.status} ${fetchResult.statusText}`,
            ToastAndroid.SHORT
        );
    }

    return result;
};
