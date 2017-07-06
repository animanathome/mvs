var http = require("https");
var Q = require("q");

var movies = (function(){	
	var hostname = 'api.themoviedb.org'
	var api_key = '1a899ad77496510e9c5643b05f17146a'

	var configuration = function(){
		// https://developers.themoviedb.org/3/configuration/get-api-configuration
		var deferred = Q.defer();

		var get_path = function(){
			return "/3/configuration?api_key="+api_key
		}

		var options = {
		  "method": "GET",
		  "hostname": hostname,
		  "port": null,
		  "path": get_path(),
		  "headers": {}
		};

		var req = http.request(options, function (res) {
		  var chunks = [];

		  res.on("data", function (chunk) {
			chunks.push(chunk);
		  });

		  res.on("end", function () {
			var body = Buffer.concat(chunks);
			deferred.resolve(body.toString());
		  });
		});

		req.write("{}");
		req.end();

		return deferred.promise;
	}

	var query = function(path){
		var deferred = Q.defer();

		var options = {
		  "method": "GET",
		  "hostname": hostname,
		  "port": null,
		  "path": path,
		  "headers": {}
		};

		var req = http.request(options, function (res) {
		  var chunks = [];

		  res.on("data", function (chunk) {
			chunks.push(chunk);
		  });

		  res.on("end", function () {
			var body = Buffer.concat(chunks);
			// console.log('result', body.toString())
			deferred.resolve(body.toString());
		  });
		});

		req.write("{}");
		req.end();

		return deferred.promise;
	}

	var discover = function(input){
		console.log('discover', input)

		var year = input.year || '2017';
		var sort_by;
		switch(input.sort || 'pd'){
			case 'pd': sort_by = 'popularity.desc'; break;
			case 'pa': sort_by = 'popularity.asc'; break;

			case 'rd': sort_by = 'revenue.desc'; break;
			case 'ra': sort_by = 'revenue.asc'; break;

			case 'otd': sort_by = 'original_title.desc'; break;
			case 'ota': sort_by = 'original_title.asc'; break;

			case 'vod': sort_by = 'vote_average.desc'; break;
			case 'voa': sort_by = 'vote_average.asc'; break;

			case 'rdd': sort_by = 'release_date.asc'; break;
			case 'rda': sort_by = 'release_date.desc'; break;
		}
		var page = input.page || 1;
		var with_genres = input.genre

		console.log('year:', year)
		console.log('sort_by:', sort_by)
		console.log('genres:', with_genres)
		console.log('page:', page)

		var path = '/3/discover/movie?'
		path += 'primary_release_date.gte='+year+'-01-01'
		path += '&primary_release_date.lte='+year+'-12-30'
		path += '&region=US&language=en-US'
		path += '&sort_by='+sort_by
		if(with_genres){
			path += '&with_genres='+with_genres
		}
		path += '&page='+page
		path += '&api_key='+api_key

		console.log('full query', path)

		return query(path)
	}	

	var upcoming = function(input){
		console.log('upcoming', input)

		// var deferred = Q.defer();

		var get_path = function(input){
			var page = 1;
			if(input != undefined && input.hasOwnProperty('page')){
				page = input.page;
			}

			return "/3/movie/upcoming?page="+page+"&region=US&language=en-US&api_key="+api_key
		}
		
		return query(get_path(input))
	}

	return {
		configuration: configuration,
		upcoming: upcoming,
		discover: discover,
		find: discover
	}
})()

module.exports = movies