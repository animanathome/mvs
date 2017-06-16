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

	var upcoming = function(input){
		console.log('upcoming', input)

		var deferred = Q.defer();

		var get_path = function(input){
			var page = 1;
			if(input != undefined && input.hasOwnProperty('page')){
				page = input.page;
			}

			return "/3/movie/upcoming?page="+page+"&region=US&language=en-US&api_key="+api_key
		}

		var options = {
		  "method": "GET",
		  "hostname": hostname,
		  "port": null,
		  "path": get_path(input),
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

	return {
		configuration: configuration,
		upcoming: upcoming
	}
})()

module.exports = movies