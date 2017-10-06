var Q = require("q")
var movie = require('../models/movies.js')

var movies = (function(){

	var list = function(data){
		console.log('list', data)

		var deferred = Q.defer();

		if(data === undefined){
			data = {
				track:true, 
				available:true
			}
		}

		movie.find(data, {
			myear:1, 
			mtitle:1, 
			poster_path:1, 
			overview:1, 
			genre_ids:1,
			available:1
		}, function(err, movies){
			
			if(err){
				console.error(err);
				deferred.reject(err);
			}else{
				// console.log(movies)
				var data = []
				for(var i = 0; i < movies.length; i++){
					data.push({
						id: movies[i]._id,
						year: movies[i].myear,
						title: movies[i].mtitle,
						poster_path: movies[i].poster_path,
						overview: movies[i].overview,
						genre_ids: movies[i].genre_ids,
						movie_path: movies[i].movie_path,
						available: movies[i].available
					})
				}
				console.log('data', data)
				deferred.resolve(data);
			}
		})

		return deferred.promise;
	}

	var get = function(data){
		var deferred = Q.defer();
		
		movie.findOne({
			mtitle:data.title
		}, {
			movie_path:1, 
			overview:1, 
			genre_ids:1, 
			backdrop_path:1
		}, function(err, result){			
			if(err){
				deferred.reject(err)
			}else{
				console.log('details:', result)
				deferred.resolve(result);
			}
		})
		return deferred.promise;
	}

	var add = function(input){
		var deferred = Q.defer();

		movie.findOne({ mid: input.data.mid }, function(err, result){
			// console.log('findOne')
			// console.log(err, result)
			// console.log('------')
			if(err){
				// console.error(err);
				deferred.reject(err)
			}else{
				// only add a given entry if it doesn't exist
				if(result === null){
					var m = new movie(input.data)
					m.save(function(err){
						if(err){
							// console.error('error', err)
							deferred.reject(err)
						}else{
							console.log('Added', m.mtitle+'('+m.myear+')', 'to watch list.')
							// movie.count({}, function(err, result){
							// 	console.log('Count is '+result)
							// })
							deferred.resolve();
						}
					})
				}else{
					deferred.resolve();
					// console.log(input.data.mtitle, 'is already on the list')
				}
			}
		});

		return deferred.promise;
	}

	var remove = function(input){
		var deferred = Q.defer();

		movie.findOneAndRemove({ _id: input.data.id }, function(err, other){
			if(err){
				// console.error(err);
				deferred.reject(err)
			}else{
				// console.log('done deleting', other)
				deferred.resolve();
			}
		})

		return deferred.promise;
	}

	var update = function(data){
		var deferred = Q.defer();

		movie.findOneAndUpdate({
			_id:data.id
		}, {
			$set:data.update
		}, function(err, result){
			// console.log(err, result)
			if(err){
				deferred.reject(err)
			}else{
				deferred.resolve();
			}
		})

		return deferred.promise;
	}

	return {
		get: get,
		list: list,
		add: add,
		remove: remove,
		update: update
	}
})()

module.exports = movies