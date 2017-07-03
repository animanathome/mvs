# https://developers.themoviedb.org/3/discover
# https://developers.themoviedb.org/3/movies/get-upcoming
import requests
import json

base_url = 'https://api.themoviedb.org'
api_key = '1a899ad77496510e9c5643b05f17146a'

# url = base_url+'/3/discover/movie?api_key='+api_key+'&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1'


# upcoming movies
url = base_url+'/3/movie/upcoming?api_key='+api_key+'&language=en-US&page=1'

payload = "{}"
response = requests.request("GET", url, data=payload)
result = json.loads(response.text)


# for item in result['results']:
	# print item['original_title']

def upcoming_movies():
	# upcoming movies
	url = base_url+'/3/movie/upcoming?api_key='+api_key+'&region=US&language=en-US&region=US'
	payload = "{}"
	response = requests.request("GET", url, data=payload)
	result = json.loads(response.text)

	print 'number of results:', result['total_results']
	print 'date range:', result['dates']
	# print result

	mc = 0
	for pi in range(1, result['total_pages']):
		response = requests.request("GET", url+'&page='+str(pi), data=payload)
		result = json.loads(response.text)

		for movie in result['results']:
			mc+=1
			print mc, movie['release_date'], movie['title'] 

# upcoming_movies()