var http = require("https")
var Q = require("q");

var hostname = 'api.themoviedb.org'
var api_key = '1a899ad77496510e9c5643b05f17146a'

var page = 1;
var path = '/3/discover/movie?'
path += 'primary_release_date.gte=2017-01-01'
path += '&primary_release_date.lte=2017-12-30'
path += '&region=US&language=en-US'
path += '&sort_by=release_date.desc'
path += '&page='+page
path += '&api_key='+api_key

getList = function(uri){
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
		deferred.resolve(JSON.parse(body.toString()));
	  });
	});

	req.write("{}");
	req.end();

	return deferred.promise;
}


getList(path)
.then(function(movies){
	// console.log(movies)

	for(var i = 0; i < movies.results.length; i++){
		console.log(movies.results[i].release_date, movies.results[i].title)
	}
})
