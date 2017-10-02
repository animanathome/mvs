var http = require("https");
var Q = require("q");

var series = (function(){

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

	var season_details = function(input){
		console.log('season_details', input)

		if(input.tv_id === undefined){
			input.tv_id = '1399';
		}
		if(input.season_number === undefined){
			input.season_number = '7';
		}

		var path = '/3/tv/'
		path += input.tv_id
		path += '/season/'
		path += input.season_number
		path += '?api_key='+api_key
		path += '&language=en-US'
		return query(path)

		// /tv/{tv_id}/season/{season_number}
		// 1399
		// 7
		// https://api.themoviedb.org/3/tv/1399/season/7?api_key=1a899ad77496510e9c5643b05f17146a&language=en-US
	
		// air_date
		// name
		// overview
		// mid -> id
		// still_path
		// vote_average
	}

	var details = function(input){
		// https://api.themoviedb.org/3/tv/1399?api_key=1a899ad77496510e9c5643b05f17146a&language=en-US
		var path = '/3/tv/'+input.id
		path += '?api_key='+api_key
		path += '&language=en-US'
		return query(path)
	}

	var discover = function(input){
		console.log('discover', input)

		if(input.year === undefined){
			input.year = '2017';
		}
		if(input.sort === undefined){
			input.sort = 'pd';
		}

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

		var path = '/3/discover/tv?'
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

			return "/3/tv/upcoming?page="+page+"&region=US&language=en-US&api_key="+api_key
		}
		
		return query(get_path(input))
	}

	return {
		configuration: configuration,
		upcoming: upcoming,
		discover: discover,
		find: discover,
		details: details,
		season_details: season_details
	}
})()

module.exports = series