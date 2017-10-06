var Q = require("q")
var tmdbm = require('../controls/tmdbm.js')
var tmdbs = require('../controls/tmdbs.js')
var _series = require('../controls/series.js')
var _movies = require('../controls/movies.js')

var routes = (function(){

	var getSeries = function(query){
		console.log('getSeries', query)

		var deferred = Q.defer();

		switch(query.action){
			case "genres":
				tmdbs.genres()
				.then(function(data){
					console.log("got genres back:", data)
					deferred.resolve(data)
				})
			break;

			case "list_episodes":
				_series.listEpisodes({
					track:true,
					available:false
				})
				.then(function(data){
					deferred.resolve(data)
				})
			break;

			default:
				setTimeout(function(){
					deferred.reject('Unknown action')
				})
		}

		return deferred.promise;
	}

	var setSeries = function(result){
		console.log('set', result)

		var deferred = Q.defer();

		switch(result.action){
			case "update_episode":
				_series.updateEpisode(result.data)
				.then(function(){
					deferred.resolve()
				})
			break;

			default:
				setTimeout(function(){
					deferred.reject('Unknown action')
				})
		}

		return deferred.promise;
	}

	var getMovies = function(query){
		console.log('getMovies', query)

		var deferred = Q.defer();

		switch(query.action){
			case "genres":
				tmdbm.genres()
				.then(function(data){
					console.log("got genres back:", data)
					deferred.resolve(data)
				})
			break;
			
			case "list":
				_movies.list({
					track:true, 
					available:false
				})
				.then(function(data){
					deferred.resolve(data)
				})
			break;

			default:
				setTimeout(function(){
					deferred.reject('Unknown action')
				})
		}

		return deferred.promise;
	}

	var setMovies = function(result){
		console.log('setMovies', result)

		var deferred = Q.defer();

		switch(result.action){
			case "update":
				_movies.update(result.data)
				.then(function(){
					deferred.resolve()
				})
			break;

			default:
				setTimeout(function(){
					deferred.reject('Unknown action')
				})
		}

		return deferred.promise;
	}	

	return {
		getSeries: getSeries,
		setSeries: setSeries,
		getMovies: getMovies,
		setMovies: setMovies,
	}
})()

module.exports = routes