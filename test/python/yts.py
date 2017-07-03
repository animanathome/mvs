import requests
import json

url = 'https://yts.ag/api/v2/list_movies.json'

# print 'send'
# payload = "{}"
# response = requests.request("GET", url, data=payload)
# result = response.text
# print 'done', result


title = "Power Rangers"
url = 'https://yts.ag/api/v2/list_movies.json?query_term='+title
payload = "{}"
response = requests.request("GET", url, data=payload)
result = json.loads(response.text)
print result.keys()

for i, item in enumerate(result['data']['movies'][0]['torrents']):
	print i, item


# magnet:?xt=urn:btih:TORRENT_HASH&dn=Url+Encoded+Movie+Name&tr=http://track.one:1234/announce&tr=udp://track.two:80

# https://stackoverflow.com/questions/6556657/downloading-a-torrent-with-libtorrent-python
