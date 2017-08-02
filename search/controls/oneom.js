var fetch = require('node-fetch');
var Q = require("q");
var WebTorrent = require('webtorrent')

var oneom = (function(){

	getMagnetURI = function(title, season, episode){
	
		title = encodeURIComponent(title)
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
				return Promise.reject("Unable to find result for", title);
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
					var torrent;

					for(j = 0; j < ep[i].torrent.length; j++){

						if(ep[i].torrent[j].seed > max_seed){
							max_seed = ep[i].torrent[j].seed;
							torrent = ep[i].torrent[j]
						}
					}
					console.log('magnetic link:', torrent.value)
					return torrent.value
				}
			}
		})
	}

	getDownloadDir = function(){
		var download_dir = __dirname+'/../../download'
		if (!fs.existsSync(download_dir)){
			fs.mkdirSync(download_dir);
		}
		return download_dir;
	}

	downloadTorrent = function(magnetURI){
		var deferred = Q.defer();

		var client = new WebTorrent()
		client.add(magnetURI, { path: getDownloadDir() }, function (torrent) {
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
		getMagnetURI: getMagnetURI,
		downloadTorrent: downloadTorrent
	}
})()

module.exports = oneom