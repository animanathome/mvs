var fetch = require('node-fetch');
var Q = require("q");
var WebTorrent = require('webtorrent')
var fs = require('fs')

var oneom = (function(){

	getMagnetURI = function(name, season, episode){
		var deferred = Q.defer();

		title = encodeURIComponent(name)
		season = ('00'+season).substring(season.length)
		episode = ('00'+episode).substring(episode.length)

		qsuri = "https://oneom.tk/search/serial?limit=1&title="
		qiuri = "https://oneom.tk/serial/"
		headers = {headers:{'Accept': 'application/json'}}

		fetch(qsuri+title, headers)
		.then(function(res){
			return res.json()
		})
		.then(function(data){
			if(data.serials.length !== 1){
				return Promise.reject("Unable to find result for", name);
			}
			console.log('tv id:', data.serials[0].id)
			return fetch(qiuri+data.serials[0].id, headers)
		})
		.then(function(res){
			return res.json()
		})
		.then(function(data){
			// console.log(data.serial.ep)
			var i, j;
			var ep = data.serial.ep
			for(i = 0; i < ep.length; i++){
				if(ep[i].season === season && ep[i].ep === episode){
					console.log('season:', ep[i].season, '- episode:', ep[i].ep)
					// console.log('torrent:', ep[i].torrent)

					// get the torrent with the most amount of seeders
					var max_seed = 0;
					var torrent = null;

					for(j = 0; j < ep[i].torrent.length; j++){

						// make sure we're dealing with a MP4 file
						if(ep[i].torrent[j].title.match('x264') !== null
						|| ep[i].torrent[j].title.match('x265') !== null
						|| ep[i].torrent[j].title.match('h264') !== null
						|| ep[i].torrent[j].title.match('h265') !== null
						){
							if(ep[i].torrent[j].seed > max_seed){
								max_seed = ep[i].torrent[j].seed;
								torrent = ep[i].torrent[j]
							}
						}
					}

					if(torrent === null){
						deferred.reject('Unable to find torrent which contains an MP4')
					}else{
						// console.log('magnetic link:', torrent.value)
						deferred.resolve({
							name:name,
							season:season,
							episode:episode,
							magnetURI:torrent.value
						})
					}
				}
			}
			deferred.reject('No match found for', name)
		})

		return deferred.promise;
	}

	getDownloadDir = function(sub_folders){
		console.log('getDownloadDir')

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

	downloadTorrent = function(result){
		console.log('downloadTorrent', result)
		var deferred = Q.defer();

		var item = {
			name:result.name,
			season:result.season,
			episode:result.episode
		}
		var magnetURI = result.magnetURI

		var client = new WebTorrent()
		client.add(magnetURI, { 
			path: getDownloadDir(['series', result.name, result.season])
		}, function(torrent){
			console.log('torrent')

			torrent.on('done', onDone)
			var interval = setInterval(onProgress, 5000)
			// onProgress()

			// console.log('path', torrent.files.path)
			// console.log('files', torrent.files)
			// get file path
			var path;
			for(var i = 0; i < torrent.files.length; i++){
				if(torrent.files[i].path.endsWith('.mp4')){
					console.log('path', torrent.files[i].path)
					path = torrent.files[i].path
					break;
				}
			}
			// extend item
			item.path = path;

			function onProgress(){
				var percent = Math.round(torrent.progress * 100 * 100) / 100;
				console.log('\t', item.name, '| progress', percent+'%')
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
		getMagnetURI: getMagnetURI,
		downloadTorrent: downloadTorrent
	}
})()

module.exports = oneom