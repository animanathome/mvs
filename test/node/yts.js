
var http = require("https")
var Q = require("q");
var WebTorrent = require('webtorrent')
var fs = require('fs')

var download_dir = __dirname+'/download';
console.log('home directory', download_dir)

if (!fs.existsSync(download_dir)){
	fs.mkdirSync(download_dir);
}

// find the given movie on yts.ag and download it

var path = "https://yts.ag/api/v2/list_movies.json?query_term="+encodeURIComponent("beauty and the beast")

getTorrent = function(uri){
	var deferred = Q.defer();
	
	var req = http.request(uri, function (res) {
		var chunks = [];
		// console.log('STATUS: ' + res.statusCode);
	  	// console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

	  	res.on("end", function () {
			var body = Buffer.concat(chunks);
			// console.log('result', body.toString())
			// console.log(JSON.parse(body.toString()))

			// var result = JSON.parse(body.toString())
			// console.log(result.data.movies[0])
			deferred.resolve(JSON.parse(body.toString()));
		});
	})
	req.write("{}");
	req.end();

	return deferred.promise;
}

var trackers = [
	"open.demonii.com:1337/announce",
	"tracker.openbittorrent.com:80",
	"tracker.coppersurfer.tk:6969",
	"glotorrents.pw:6969/announce",
	"tracker.opentrackr.org:1337/announce",
	"torrent.gresille.org:80/announce",
	"p4p.arenabg.com:1337",
	"tracker.leechers-paradise.org:6969"
]
var quality = '720p'

getMagnetURI = function(d){
	// console.log('data:', d)

	if(d.status != 'ok'){
		return
	}

	if(d.data.movie_count < 1){
		return
	}

	if(d.data.movie_count > 1){
		console.log('More then one result. Downloading first one')
	}

	// console.log(d.data.movies[0])

	var movie = d.data.movies[0];

	// console.log(d.data.movies[0].title_long, encodeURI(d.data.movies[0].title_english))

	var i, 
		torrent;
	var hash = null;
	for(i = 0; i < movie.torrents.length; i++){
		torrent = movie.torrents[i]
		if(torrent.quality != quality){
			continue
		}
		// console.log(i, torrent.hash)
		hash = torrent.hash;
	}

	if(!hash){
		console.log('Unable to find hash')
		return
	}

	var url = 'magnet:?xt=urn:btih:'
	url += hash
	url += '&dn='
	url += encodeURI(movie.title_long+'+['+quality+']+[YTS.AG]')

	for(i = 0; i < trackers.length; i++){
		url += encodeURI('&tr=udp://'+trackers[i])
	}
	return url
}

downloadTorrent = function(data){
	console.log('downloadTorrent')

	var deferred = Q.defer();

	var magnetURI = getMagnetURI(data)
	if(!magnetURI){
		setTimeout(function(){
			deferred.reject('No torrent available')
		})
	}

	var client = new WebTorrent()
	client.add(magnetURI, { path: download_dir }, function (torrent) {
		torrent.on('done', onDone)
		var interval = setInterval(onProgress, 500)
		// onProgress()

		function onProgress(){
			var percent = Math.round(torrent.progress * 100 * 100) / 100;
			console.log('\tprogress', percent)
		}

		function onDone(){
			console.log('torrent download finished')
			clearInterval(interval)
			deferred.resolve();
		}
	})

	return deferred.promise;
}

getTorrent(path)
.then(function(result){
	return downloadTorrent(result)
})
.fail(function(err){
	console.warn(err)
})
.then(function(){
	console.log('done downloading file')
})
