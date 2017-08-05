var Q = require("q")
, yts = require('./yts.js')
, oneom = require('./oneom.js');

var download = (function(){

	var series = function(request){
		console.log('series', request)

		var deferred = Q.defer();

		var _id = request._id || request.id
		var name = request.name
		var season = ('00'+request.season).substring(request.season.length)
		var episode = ('00'+request.episode).substring(request.episode.length)

		oneom.getMagnetURI(name, season, episode)
		.fail(function(err){
			console.error('ERROR:', err)
			deferred.reject(err)
		})
		.then(function(result){
			if(result === undefined){
				deferred.reject('Unable to find episode')
			}else{
				return oneom.downloadTorrent(result)
			}
		})
		.fail(function(err){
			console.error('ERROR:', err)
			deferred.reject(err)
		})
		.then(function(result){
			console.log('Done downloading:', name, '- season:', season, '- episode:', episode)
			console.log('result', result)
			
			result.item._id = _id;

			deferred.resolve(result)
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