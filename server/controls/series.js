var Q = require("q")
var Series = require('../models/series.js')
var Season = require('../models/season.js')
var Episode = require('../models/episode.js')

var tmdbs = require('../controls/tmdbs.js')

var series = (function(){

	var hasParameters = function(input, required_params){
		var i;
		for(i = 0; i < required_params.length; i++){
			if(!input.hasOwnProperty(required_params[i])){
				return false
			}
		}
		return true
	}

	// list all episodes
	var listEpisodes = function(data){
		console.log('listEpisodes', data)

		var deferred = Q.defer();
		
		if(data === undefined){
			data = {}
		}

		matchesQuery = function(item, data){
			var keys = Object.keys(data)
			var i;
			for(i = 0; i < keys.length; i++){
				if(item.hasOwnProperty(keys[i]) === null){
					console.log(item, 'does not have property', keys[i])
					return false
				}
				if(item[keys[i]] !== data[keys[i]]){
					console.log(item[keys[i]], '!=', data[keys[i]])
					return false
				}
			}
			return true
		}

		Series.find({}, function(err, results){
			// console.log(results)
			var output = []
			var i, j, k, series, season, episode;
			for(i = 0; i < results.length; i++){
				series = results[i]
				for(j = 0; j < series.seasons.length; j++){
					season = series.seasons[j]
					for(k = 0; k < season.episodes.length; k++){
						episode = season.episodes[k]
						if(matchesQuery(episode,data)){
							// console.log(i, j, k, episode)
							var info = {
								id:series._id,
								mid:series.mid,
								name:series.title,
								season:season.season,
								episode:episode.episode
							}
							// console.log('\tinfo', info)
							output.push(info)
						}
					}
				}
			}
			// console.log('result', output)
			deferred.resolve(output);
		})
		return deferred.promise;
	}

	// list all series
	var list = function(data){
		var deferred = Q.defer();

		if(data === undefined){
			data = {
				track:true, 
				available:false
			}
		}

		Series.find(data, {
			mid:1,
			myear:1, 
			mtitle:1, 
			poster_path:1, 
			overview:1, 
			genre_ids:1,
			available:1
		}, function(err, result){

			if(err){
				// console.error(err);
				deferred.reject(err);
			}

			console.log(result)

			var data = []
			for(var i = 0; i < result.length; i++){
				data.push({
					_id: result[i]._id,
					mid: result[i].mid,
					year: result[i].myear,
					title: result[i].mtitle,
					poster_path: result[i].poster_path,
					overview: result[i].overview,
					genre_ids: result[i].genre_ids
				})
			}
			deferred.resolve(data);
		})
		return deferred.promise;
	}

	// get series details
	var details = function(data){
		console.log('details', data)

		var deferred = Q.defer();

		Series.findOne({'mid':data.mid}, function(err, result){
			if(err){
				// console.error(err)
				deferred.reject(err);
			}else{
				if(result === null){
					console.log('Unable to find series')
					deferred.reject('Unable to find series');
				}else{
					var data = {
						_id: result._id,
						backdrop_path: result.backdrop_path,
						poster_path: result.poster_path,
						name: result.title,
						seasons:[]
					}
					
					console.log('get season details')

					var i, j;
					for(i = 0; i < result.seasons.length; i++){
						var info = {}
						info.season = result.seasons[i].season
						console.log(i, 'season:', info.season)

						info.episodes = result.seasons[i].episodes;
						
						var available_count = 0;
						var available = []
						for(j = 0; j < result.seasons[i].episodes.length; j++){
							console.log(j, result.seasons[i].episodes[j])
							if(result.seasons[i].episodes[j].available){
								available_count += 1;
								available.push(result.seasons[i].episodes[j].episode)
							}
						}
						info.available = available_count
						info.available_episodes = available
						
						info.track = result.seasons[i].episode_count
						data.seasons.push(info)
					}
					console.log('result:', data)
					console.log('-----------------------------')
					deferred.resolve(data);
				}
			}
		})
		return deferred.promise;
	}

	// add series
	var add = function(data){
		console.log('add', data)
		var deferred = Q.defer();

		Series.findOne({ mid: data.mid }, function(err, result){
			console.log(err, result)

			if(err){
				// console.error(err); 
				deferred.reject(err);
			}

			var addSeason = function(item){
				var deferred = Q.defer();

				if(data.season && data.episode_count){
					var i;
					var season_exists = false;
					for(i = 0; i < item.seasons.length; i++){
						if(+item.seasons[i].season === +data.season){
							season_exists = true;
						}
					}
					
					if(!season_exists){
						// get the season details
						tmdbs.season_details({
							tv_id:data.mid, 
							season_number:data.season
						})
						.then(function(season_details){
							console.log("details", season_details)

							season_details = JSON.parse(season_details)

							// create season
							var season = new Season({
								season:data.season, 
								episode_count:data.episode_count
							})

							// create episodes
							// TODO: add tmdb details here
							for(i = 0; i < data.episode_count; i++){
								var episode = new Episode({
									episode:i+1,
									track: true,

									title: season_details.episodes[i].name,
									release_date: season_details.episodes[i].air_date,
									overview: season_details.episodes[i].overview,
									vote_average: season_details.episodes[i].vote_average,
									poster_path: season_details.episodes[i].still_path
								})
								episode.save()
								season.episodes.push(episode)
							}
							item.seasons.push(season)
							season.save()
							item.save(function(err, product, numAffected){
								deferred.resolve();
							})
							console.log('Adding season', data.season)
						})
					}else{
						console.log('Season', data.season, 'already exists')
						deferred.resolve();
					}
				}else{
					setTimeout(function(){
						deferred.resolve();
					})
				}
				return deferred.promise;
			}

			if(result === null){
				var s = new Series(data)
				s.save(function(err, item){
					if(err){
						console.error('error', err)
						deferred.reject(err);
					}else{
						// console.log('item', item)
						addSeason(item)
						.then(function(){
							deferred.resolve();
						})
					}
				})
			}else{
				// console.log('Nothing to add. Series already exists.')
				addSeason(result)
				.then(function(){
					deferred.resolve();
				})
			}
		})
		return deferred.promise;
	}

	// remove series
	var remove = function(data){
		var deferred = Q.defer();

		Series.findOneAndRemove({ _id: data.id }, function(err, other){
			
			if(err){
				// console.error(err);
				deferred.reject(err)
			}
			
			console.log('Done removing series')
			deferred.resolve();
		})

		return deferred.promise;
	}

	// add season
	var addSeason = function(data){
		console.log('------------------------------')
		console.log('addSeason', data)
		var deferred = Q.defer();

		if(!data.hasOwnProperty('id')){
			// console.log('Missing id parameter')
			// return
			deferred.reject('Missing id parameter')
		}

		Series.findOne({_id:data.id}, function(err, result){
			if(err){
				// console.error(err)
				deferred.reject(err)
			}
			if(result === null){
				console.log('Series'+data+'does not exist')
				// return
				deferred.reject('Series'+data+'does not exist')
			}

			// console.log('result', result)
			var i = 0;
			var season_exists = false;
			for(i = 0; i < result.seasons.length; i++){
				console.log(+result.seasons[i].season, '->', +data.season)
				
				if(+result.seasons[i].season === +data.season){
					season_exists = true;
				}
			}

			if(!season_exists){
				console.log('Adding season', data)

				var season = new Season({
					season: data.season, 
					episode_count: data.episode_count
				})

				// create episodes
				// TODO: add tmdb details here
				for(i = 0; i < data.episode_count; i++){
					var episode = new Episode({
						episode:i+1,
						track: true
					})
					episode.save()
					season.episodes.push(episode)
				}				

				result.seasons.push(season)
				result.save()
				deferred.resolve();
			}else{
				console.log('Season', data.season, 'already exists.')
				deferred.resolve();
			}
			
		})
		return deferred.promise;
	}

	// remove season
	var removeSeason = function(data){
		console.log('removeSeason', data)
		var deferred = Q.defer();
		
		if(!data.hasOwnProperty('id')){
			// console.log('Missing id parameter')
			setTimeout(function(){
				deferred.reject('Missing id parameter')
			})
		}

		Series.findOne({_id:data.id}, function(err, result){
			if(err){
				// console.error(err);
				deferred.reject(err);
				// return
			}else{
				if(result === null){
					console.log("Unable to find entry with id", data.id)
					deferred.reject("Unable to find entry with id");
					// return
				}else{
					console.log('Found series with matching id')
					var i, ns = result.seasons.length;
					for(i = 0; i < ns; i++){
						if(+result.seasons[i].season === +data.season){
							// console.log('Found matching season:', result.seasons[i])
							result.seasons.pull(result.seasons[i])
							result.save()

							if(ns === 1){
								result.remove(function(err, removed){
									console.log('Done removing season + series')
									deferred.resolve();
								})
							}else{
								console.log('Done removing season')
								deferred.resolve();
							}
						}
					}
				}
			}
		})
		return deferred.promise;
	}

	var addEpisode = function(data){
		console.log('addEpisode', data)
		
		var deferred = Q.defer();

		if(!data.hasOwnProperty('id')){
			console.log('Missing id parameter')
			// return
			setTimeout(function(){
				deferred.reject('Missing id parameter')
			})
		}

		Series.findOne({_id:data.id}, function(err, result){
			if(err){
				// console.error(err);
				deferred.reject(err)
				// return
			}
			
			if(result === null){
				// console.log('Unable to find entry with id', data.id)
				// return
				deferred.reject('Unable to find entry with id')
			}

			console.log('Found', result)

			var i;
			for(i = 0; i < result.seasons.length; i++){
				if(+result.seasons[i].season === +data.season){
					// console.log('Match', result.seasons[i])

					var j, 
						episode_exists = false; 
					for(j = 0; j < result.seasons[i].episodes.length; j++){
						if(+result.seasons[i].episodes[j].episode === +data.episode){
							episode_exists = true;
							break;
						}
					}

					if(!episode_exists){
						console.log('Adding episode')
						
						var episode = new Episode({
							episode:data.episode, 
							path:data.path
						})
						result.seasons[i].episodes.push(episode)
						result.seasons[i].save()
						result.save()
						deferred.resolve();
					}else{
						console.log('Episode already exists')
						deferred.resolve();
					}
				}
			}
			
		})

		return deferred.promise;
	}

	var detailsEpisode = function(data){
		console.log('detailsEpisode', data)
		
		var deferred = Q.defer();

		Series.findOne({mid:data.id}, function(err, result){

			if(err){
				deferred.reject(err)
			}else{
				var output = {
					title:result.title,
					season:data.season,
					episode:data.episode,
					backdrop_path:result.backdrop_path,
					genre_ids:result.genre_ids
				}

				if(result === null){
					console.log("Unable to find series with mid "+data.id)
					deferred.reject("Unable to find series with mid "+data.id)
				}else{
					for(i = 0; i < result.seasons.length; i++){
						if(+result.seasons[i].season === +data.season){
							// console.log('Found matching season:', result.seasons[i])
							// console.log('\tepisodes:', result.seasons[i].episodes)

							var j, episode_exists = false;
							for(j = 0; j < result.seasons[i].episodes.length; j++){
								if(+result.seasons[i].episodes[j].episode === +data.episode){
									// console.log(result.seasons[i].episodes[j])
									output.movie_path = result.seasons[i].episodes[j].movie_path;
									// console.log('output:', output)
									deferred.resolve(output)
								}
							}
						}
					}
				}
			}

		})

		return deferred.promise;
	}

	var updateEpisode = function(data){
		console.log('updateEpisode', data)

		var deferred = Q.defer();

		var needsParameters = ['_id', 'season', 'episode', 'update']
		if(!hasParameters(data, needsParameters)){
			console.log('Missing one of the following parameters', needsParameters)
			deferred.reject('Missing parameters');
		}else{
			Series.findOne({_id:data._id}, function(err, result){
				if(err){
					// console.error(err);
					deferred.reject(err);
				}else{				
					if(result === null){
						// console.log('Unable to find entry with id '+data.id)
						deferred.reject('Unable to find entry with id '+data.id);
					}else{					
						console.log('Found series with matching id')
						var i;
						for(i = 0; i < result.seasons.length; i++){
							if(+result.seasons[i].season === +data.season){
								// console.log('Found matching season:', result.seasons[i])
								// console.log('\tepisodes:', result.seasons[i].episodes)

								var j, 
									episode_exists = false;
								for(j = 0; j < result.seasons[i].episodes.length; j++){
									if(+result.seasons[i].episodes[j].episode === +data.episode){
										episode_exists = true;
										console.log('Updating episode', data.episode)
										
										result.seasons[i].episodes[j].set(data.update)
										
										result.seasons[i].save()
										result.set({'update':{'available':true}})
										result.save(function(err){
											deferred.resolve(data);
										})
									}
								}
								if(!episode_exists){
									console.log('No episode do remove')
								}
							}
						}
					}
				}
			})
		}
		return deferred.promise;
	}

	var removeEpisode = function(data){
		console.log('removeEpisode', data)
		
		var deferred = Q.defer();

		var needsParameters = ['id', 'season', 'episode']
		if(!hasParameters(data, needsParameters)){
			console.log('Missing one of the following parameters', needsParameters)
			deferred.reject('Missing parameters');
		}else{
			Series.findOne({_id:data.id}, function(err, result){
				if(err){
					deferred.reject(err);
				}else{					
					if(result === null){
						// console.log('Unable to find entry with id', data.id)
						deferred.reject('Unable to find entry with id '+data.id);
					}else{
						console.log('Found series with matching id')
						var i;
						for(i = 0; i < result.seasons.length; i++){
							if(+result.seasons[i].season === +data.season){
								// console.log('Found matching season:', result.seasons[i])
								// console.log('\tepisodes:', result.seasons[i].episodes)
								var j, 
									episode_exists = false;
								for(j = 0; j < result.seasons[i].episodes.length; j++){
									if(+result.seasons[i].episodes[j].episode === +data.episode){
										episode_exists = true;
										console.log('Removing episode', data.episode)
										result.seasons[i].episodes.pull(result.seasons[i].episodes[j])
										result.seasons[i].save()
										result.save(function(err){
											deferred.resolve();
										})
									}
								}
								if(!episode_exists){
									console.log('No episode do remove')
								}
							}
						}
					}
				}
			})
		}
		return deferred.promise;
	}

	return {
		list: list,
		details: details,
		add: add,
		remove: remove,
		
		addSeason: addSeason,
		removeSeason: removeSeason,
		
		listEpisodes: listEpisodes,
		detailsEpisode: detailsEpisode,
		addEpisode: addEpisode,
		updateEpisode: updateEpisode,
		removeEpisode: removeEpisode
	}
})()

module.exports = series