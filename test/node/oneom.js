
// TODO: figure out why we can't get this query to work with https or request
var fetch = require('node-fetch');

// get series id
var title = "Game of Thrones"
var season = '07'
var episode = '03'

// var str = '2'
// console.log(('00'+str).substring(str.length))

fetch("https://oneom.tk/search/serial?limit=1&title="+encodeURIComponent(title), {headers:{'Accept': 'application/json'}})
.then(function(res){	
	return res.json()
})
.then(function(data){
	if(data.serials.length !== 1){
		return Promise.reject("Unable to find result for", title);
	}
	console.log('tv id:', data.serials[0].id)
	return fetch("https://oneom.tk/serial/"+data.serials[0].id, {headers:{'Accept': 'application/json'}})
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
			// console.log('magnetic link:', torrent.value)
			console.log('result', torrent)
			return torrent.value
		}
	}
})
.then(function(data){
	console.log('result', data)
})
