var Q = require("q")
, yts = require('./yts.js')
, oneom = require('./oneom.js');

var download = (function(){

	var series = function(request){
		console.log('series', request)

		var deferred = Q.defer();

		var _id = request._id || request.id
		var title = encodeURIComponent(request.name)
		var season = ('00'+request.season).substring(request.season.length)
		var episode = ('00'+request.episode).substring(request.episode.length)

		oneom.getMagnetURI(title, season, episode)
		.fail(function(err){
			console.error('ERROR:', err)
			deferred.reject(err)
		})
		.then(function(result){
			return oneom.downloadTorrent(result)
		})
		.fail(function(err){
			console.error('ERROR:', err)
			deferred.reject(err)
		})
		.then(function(result){
			console.log('Done downloading:', title, '- season:', season, '- episode:', episode)
			deferred.resolve({
				_id: _id,
				title: title,
				season: season,
				episode: episode,
				movie_path: result.item.path
			})
		})
		return deferred.promise;
	}

	var movie = function(request){
		console.log('movie', request)

		var deferred = Q.defer();

		setTimeout(function(){
			if(!request.title || !request.year){
				// console.error('Missing parameters')
				deferred.reject('Missing parameters. Requires both title and year.')
			}
		})

		yts.getTorrent(request)
		.fail(function(err){
			console.error('ERROR:', err)
			deferred.reject(err)
		})
		.then(function(result){
			// console.log('result', result)
			
			if(result !== undefined 
			&& result.data 
			&& result.data.movie_count > 0){
				return yts.downloadTorrent(result)
			}else{
				// console.log('--------')
				// console.log(result)
				// console.log('--------')
				deferred.reject(console.error('No torrent available yet for', req.body.title+' ('+req.body.year+')'))
			}
		})
		.fail(function(err){
			console.error('ERROR:', err)
			deferred.reject(err)
		})
		.then(function(result){
			console.log('Done downloading', result)
			deferred.resolve(result)
		})
		return deferred.promise;
	}

	return {
		series:series,
		movie:movie
	}
})()

module.exports = download