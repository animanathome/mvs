var http = require("https")
var Q = require("q");
var WebTorrent = require('webtorrent')
var fs = require('fs')

var yts = (function(){

	var quality = '720p'
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

	getTorrent = function(title){
		console.log('getTorrent', title)

		var uri = "https://yts.ag/api/v2/list_movies.json?query_term="+encodeURIComponent(title)
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

				var result = JSON.parse(body.toString())
				if(result.status === 'ok'){
					if(result.data.movie_count > 0){
						deferred.resolve(result.data);
					}else{
						deferred.reject('No match found for "'+title+'"')
					}
				}else{
					deferred.reject('Returned status "'+result.status+'" for '+title)
				}
			});
		})
		req.write("{}");
		req.end();

		return deferred.promise;
	}	

	getDownloadDir = function(){
		var download_dir = __dirname+'/../download'
		if (!fs.existsSync(download_dir)){
			fs.mkdirSync(download_dir);
		}
		return download_dir;
	}

	getMagnetURI = function(d){
		console.log('getMagnetURI', d)

		if(d.movie_count > 1){
			console.log('More then one result. Downloading first one "'+d.movies[0].title_long+'"')
		}

		var movie = d.movies[0]
		var i, 
			torrent;
		var hash = null;
		for(i = 0; i < movie.torrents.length; i++){
			torrent = movie.torrents[i]

			console.log(i, '--> torrent', torrent)

			if(torrent.quality != quality){
				continue
			}
			console.log(i, '--> hash', torrent.hash)
			hash = torrent.hash;
		}

		if(!hash){
			console.log('Unable to find hash', hash)
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
		console.log('downloadTorrent', data)

		var deferred = Q.defer();

		var magnetURI = getMagnetURI(data) || null
		console.log('---> URI:', magnetURI)
		if(!magnetURI){
			setTimeout(function(){
				deferred.reject('No torrent available')
			})
		}

		var client = new WebTorrent()
		client.add(magnetURI, { path: getDownloadDir() }, function (torrent) {
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

	return {
		getTorrent: getTorrent,
		getMagnetURI: getMagnetURI,
		downloadTorrent: downloadTorrent
	}
})()

module.exports = yts