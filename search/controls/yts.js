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

	var getTorrent = function(item){
		console.log('yts - getTorrent', item)
		var title = item.title;
		var year = item.year

		// NOTE: here we can't specify the year
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
						deferred.resolve({
							data:result.data,
							item:item
						});
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

	var getDownloadDir = function(sub_folders){
		console.log('yts - getDownloadDir')

		// root download directory
		var download_dir = __dirname+'/../../download'
		if (!fs.existsSync(download_dir)){
			fs.mkdirSync(download_dir);
		}

		// create any given sub folders if necessary
		var i;
		for(i in sub_folders){
			download_dir += '/'+sub_folders[i]
			if (!fs.existsSync(download_dir)){
				fs.mkdirSync(download_dir);
			}
		}

		console.log('\tresult:', download_dir)
		return download_dir;
	}

	var getMagnetURI = function(d, item){
		console.log('yts - getMagnetURI')
		// console.trace()
		// console.log('\tdata', d)
		// console.log('\titem', item)

		if(d.movie_count > 1){
			console.log('More then one result. Downloading first one "'+d.movies[0].title_long+'"')
		}

		var i, 
			movie;
		for(i = 0; i < d.movies.length; i++){
			console.log(i, d.movies[i].year, '!=', item.year)
			if(d.movies[i].year == item.year){
				movie = d.movies[i]
				break;
			}
		}
		
		if(movie === undefined){
			console.log('Unable to find title', item.title)
			return
		}

		// var movie = d.movies[0]
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

	var downloadTorrent = function(result){
		console.log('yts - downloadTorrent', result)

		var deferred = Q.defer();

		var data = result.data;
		var item = result.item;

		var magnetURI = getMagnetURI(data, item) || null
		console.log('---> URI:', magnetURI)
		if(!magnetURI){
			setTimeout(function(){
				deferred.reject('No torrent available')
			})
		}

		var client = new WebTorrent()
		client.add(magnetURI, { path: getDownloadDir(['movies']) }, function (torrent) {
			torrent.on('done', onDone)
			var interval = setInterval(onProgress, 5000)
			// onProgress()

			// console.log('path', torrent.files.path)
			// console.log('files', torrent.files)
			// get file path
			var path;
			for(var i = 0; i < torrent.files.length; i++){
				if(torrent.files[i].path.endsWith('.mp4')){
					// console.log('path', torrent.files[i].path)
					path = torrent.files[i].path
					break;
				}
			}
			// extend item
			item.path = path;

			function onProgress(){
				var percent = Math.round(torrent.progress * 100 * 100) / 100;
				console.log('\t', item.title, '| progress', percent+'%')
			}

			function onDone(){
				console.log('torrent download finished')
				clearInterval(interval)
				deferred.resolve({
					item:item
				});
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