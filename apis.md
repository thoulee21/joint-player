GET http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=daddy&type=1&offset=0&total=true&limit=20 HTTP/1.1
# 搜索单曲（hop）

###
GET http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=hop&type=1000&offset=0&total=true&limit=20 HTTP/1.1
# 搜索歌单 (hop)

###
GET https://music.163.com/api/playlist/detail?id=4926388301 HTTP/1.1
# 歌单详情 (4926388301)

###
GET http://music.163.com/api/mv/detail?id=10927213&type=mp4 HTTP/1.1
# MV (10927213)

###
GET https://music.163.com/api/v1/user/detail/1492028517 HTTP/1.1
# 用户信息 (1492028517)

###
GET http://music.163.com/api/song/detail/?id=1347133940&ids=%5B1347133940%5D HTTP/1.1
# 歌曲信息 (1347133940)

###
GET http://api.woobx.cn/exempt/poetry HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
Cache-Control: max-age=0
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.56
Upgrade-Insecure-Requests: 1
# 获取一句古诗（Woodenbox）
