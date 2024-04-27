import useSWR from 'swr';
import { randomUserAgent } from '../services';
import { Main as PlaylistMain } from '../types/playlist';

export const usePlaylist = (id?: number) => {
    const defaultId = 2279582982;
    const init = {
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'cache-control': 'max-age=0',
            'priority': 'u=0, i',
            'sec-ch-ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'cookie': 'NMTID=00OmrdBkrCTepOkGEC1oi9r3_5h3jIAAAGKebcOMg; _iuqxldmzr_=32; _ntes_nnid=4e7dc8927f3fde8f992ac3a13c5b152c,1694259169808; _ntes_nuid=4e7dc8927f3fde8f992ac3a13c5b152c; WEVNSM=1.0.0; WNMCID=oouawq.1694259170322.01.0; WM_TID=sC4t2KBlB1REFAVUBFfQnGqDyn8WEvpX; ntes_utid=tid._.l6FQQCjlFlNBAwVRQVKQiXvDjytYFv0p._.0; sDeviceId=YD-twzhBR7TvPZAUhBRBFfFiT6Dym5MA7m1; __snaker__id=fa5ymXa34XyEif75; YD00000558929251%3AWM_NI=64E7xZoBqps2UDqD%2FeeaD0vMqBw8he7wHrNUkFiso3N8xPKGv2MpS7NmzBd08pPhIpXX1mimMe1VnO9OeAOwobzFLJjemGOPQ8QoOPWj%2F9SGiHqreMIfrz8NqbSqbxRoWmU%3D; YD00000558929251%3AWM_NIKE=9ca17ae2e6ffcda170e2e6eeb7f66afcba8a8dec3aa1868bb6d15e868f9ab0c56688af8894f743aa8a848cb62af0fea7c3b92af6ec8bd8fb52ad9ebf91f23a979cbfa5ae6fa7bf8cd1f547b39eb9d9eb6ff5a98893cd5fa99aa794ee398ee8b8b1ca4db6ee8391d23d8eb3b6a3e73cfcb0a089cc7c9c88ff8eec678fbbffb7ed45fb91aba2ce7dadbeb6a7cf42aabba3a8ce5c93e89f90ce5c95b6e1dad24dab98bf93e8478bbabe9bbb46b3be9d92e17492b1998ed837e2a3; YD00000558929251%3AWM_TID=bANBgdkCRtlEBBVAQBfE2X7C4oZnUKxv; ntes_kaola_ad=1; nts_mail_user=thought_lzh1@163.com:-1:1; MUSIC_U=00B4F04DD577B65791B42F8EF496B7D623C4E07BEABECFD35A329D6CB7C443095A44E17B07D23BE13EC63C2F19FF7693A84CAF1D240204D45999375FA2E98571C75B315C4B68610BBC61B56B74873B6257DE72F1B306B31E0356E6D547D89656457226422886FEC4C6AAFFACB8E4E49498E8EB4FC7D3E2464DAC979F99DD48CE662C616A13D794C9F146B1B437F466D84E0925ECF6D1011D0A38D1079D258AB8FEEDFA63626465CA5D880130ECCCEC1F830A8D07C5DB2B011EB4A8A543D7167447C6928FF814983885F9EAB9A0D6D9CC7D1FA9218E080F218881AF5EC56FC77E8934C02BFB85789A3E6232789836A2D8C0D94ECE634AEC21B325639C94D4E816AA934947F4A2796E5980354B4CAE8CF23DF061ADA6D83F035FAF5CA4C3E11A053F31994B0A0BC260746CD191DF8F62543E6027700E345D174C63AF824CC221238C3B076777315B9BD1B06ABC9AD8700BEC58E227CCDB05EC330272BED3496D312A; gdxidpyhxdE=3IGil3PWcgSD%2B6Y%2BbMIjIANghKbdkMifircO8sNYkYRvV6k%2Bxbe%5CD5nNHNTGMl5yA2vnuWvXLY0ATP0uhlkgl5RKbwdC5E3SQK3mLSA0Wv%2F7pvV8B2nQVsK0s6vkEJXOz9YNdwBW81gGrnJxuXhZzTyI8b6%5Cx84ImLf4CIYfHyNAmdEt%3A1712333283081; NTES_P_UTID=gR0rsrpJhbVSnRXZ5aF1ZCDjia2Kq3nY|1713603279; P_INFO=thought_lzh1@163.com|1713603279|1|mail163|00&99|null&null&null#shh&null#10#0#0|&0||thought_lzh1@163.com; __csrf=cabd24c8a6079331ce23f007efdf6fd4; __csrf=cabd24c8a6079331ce23f007efdf6fd4; NTES_PASSPORT=LMlwraWa3DtLV9yaRpHQ8pkw_MT8GwdEGdiZSrqAz7vVNK67NXivTdl5yqU8azXtX0X2PaAVNsnlrc0CTawRgfmug4uIuidPzDW1n_Ev025q8L.mWt22saHbNispOIqkc6acaMtV4SiyT8cSRlvI9HAWNOhIBOAuiZ2NthcDYaCAo22TLj7QKYHMMAClHQal.; JSESSIONID-WYYY=cyl%2BePmlG1UxsMuXXWg8s6hzXt0d8hufkH%5C8%2FX%2BQ%2BIrMs%5CCv054ud0NmCz0px0xbgJXG2ncNCKIRmo0Tr2V6vP74CFD%2BJd6PZFklpWe%5Caj4CP%5C7EEPUPd2R%2FuDN8G5kocSuP2w%5CmyhhbF2i6deaZoyNVX3E5qPnq8SCB0xBJAAdG3czv%3A1713952339398; WM_NI=VsFff7jxfS1UlFBZ4ItPvHtttmOmSiGL%2F3DFNjYyKJa9%2BS0TF0EZXrwt3c5p1pabDiMVMCH9DcyF5XT9HMuo27UwR7TrRYSkKCoxyqJD1EDjbMCfNDOKk0HX0QVz%2B0ZrUUc%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb1cc49898dbfabe66f968a8fb3c85e929a9e83c47ab099e186c96e91be968cca2af0fea7c3b92a96ad8a87e53daaa8aab4b45fb09a8ebbb743b890baa9f780b8b3818ed2638594e1d4c74e8eb6979aca42a3e7e5b4b36086f08bbbdb7ab5acfd84b87cf3b0af83c7638f8a83a4cb3388bdb7a7b85498e788aef865f2e99b98d13d98ae9ebad261899da199fc7b8a9cffa6c762a2938d87cd508d95a5d1cb54f48f9a9baa3c9aae9bb6e237e2a3',
            'user-agent': randomUserAgent.toString(),
        },
        'referrerPolicy': 'strict-origin-when-cross-origin',
        'body': null,
        'method': 'GET',
    };

    return useSWR<PlaylistMain>(
        `https://music.163.com/api/playlist/detail?id=${id || defaultId}`,
        (url: string) => fetch(url, init as RequestInit).then((res) => res.json()),
    );
};
