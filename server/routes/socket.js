var tmdbm = require('../controls/tmdbm.js')
var tmdbs = require('../controls/tmdbs.js')

var movie = require('../models/movies.js')
var series = require('../models/series.js')
var season = require('../models/season.js')
var episode = require('../models/episode.js')

module.exports = function (socket) {
	socket.emit('init', {
		action: 'init'
	});

	socket.on('connect', function () {
		console.log('connect')
	});

	socket.on('disconnect', function () {
		console.log('disconnect')
	});

	socket.on('item:getByName', function(data){
		console.log('item:getByName', data)

		movie.findOne({
			mtitle:data.title
		}, {
			movie_path:1, 
			overview:1, 
			genre_ids:1, 
			backdrop_path:1
		}, function(err, result){
			
			if(err){
				console.error(err);
			}

			console.log('details:', result)

			socket.emit('item:getByName', {
				'data': result
			})
		})
	})

	// update a given entry
	socket.on('item:update', function(data){
		console.warn('Deprecated, use series or movies instead.')
	})

	socket.on('series:update', function(data){
		series.findOne({_id:data.id}, function(err, result){
			if(err){
				console.error(err);
			}
		})
	})

	socket.on('movie:update', function(data){
		console.log('movie:update', {_id:data.id}, {$set:data.update})
		movie.findOneAndUpdate({
			_id:data.id
		}, {
			$set:data.update
		}, function(err, result){
			// console.log(err, result)
			
			if(err){
				console.error(err)
			}
		})
	})

	// list of movies which are available
	socket.on('movies:watch', function(){
		console.log('movies:watch')

		movie.find({
			track:true, 
			available:true
		}, {
			myear:1, 
			mtitle:1, 
			poster_path:1, 
			overview:1, 
			genre_ids:1
		}, function(err, movies){
			
			if(err){
				console.error(err);
			}

			console.log(movies)

			var data = []
			for(var i = 0; i < movies.length; i++){
				data.push({
					id: movies[i]._id,
					title: movies[i].mtitle,
					poster_path: movies[i].poster_path,
					overview: movies[i].overview,
					genre_ids: movies[i].genre_ids,
					movie_path: movies[i].movie_path
				})
			}

			socket.emit('movies:watch', {
				'data': data
			})
		})
	});

	// LIST
	socket.on('series:list_details', function(input){
		console.log('input:', input)

		series.findOne({'mid':input.mid}, function(err, res){
			if(err){
				console.error(err)
			}

			console.log('result', res)

			var data = {
				_id: res._id,
				backdrop_path: res.backdrop_path,
				poster_path: res.poster_path,
				name: res.title,
				seasons:[]
			}
			
			var i;
			for(i = 0; i < res.seasons.length; i++){
				var info = {}
				info.season = res.seasons[i].season
				info.available = res.seasons[i].episodes.length
				info.track = res.seasons[i].episode_count
				data.seasons.push(info)
			}
			// console.log(data)

			socket.emit('series:list_details', {
				'data': data
			})
		})
	})

	socket.on('series:list', function(){
		console.log('series:list')

		series.find({
			track:true, 
			available:false
		}, {
			mid:1,
			myear:1, 
			mtitle:1, 
			poster_path:1, 
			overview:1, 
			genre_ids:1
		}, function(err, result){

			if(err){
				console.error(err);
			}

			console.log(result)

			var data = []
			for(var i = 0; i < result.length; i++){
				data.push({
					id: result[i]._id,
					mid: result[i].mid,
					year: result[i].myear,
					title: result[i].mtitle,
					poster_path: result[i].poster_path,
					overview: result[i].overview,
					genre_ids: result[i].genre_ids
				})
			}

			socket.emit('series:list', {
				'data': data
			})

		})
	})


	// list of movies we're currently tracking
	socket.on('movies:list', function(){
		console.log('movies:list')
		// console.log('movie', movie)

		movie.count({}, function(err, result){
      		console.log('Count is '+result)
    	})

		movie.find({
			track:true, 
			available:false
		}, {
			myear:1, 
			mtitle:1, 
			poster_path:1, 
			overview:1, 
			genre_ids:1
		}, function(err, movies){
			console.log(err, movies)

			if(err){
				console.error(err);
			}

			console.log(movies)

			var data = []
			for(var i = 0; i < movies.length; i++){
				data.push({
					id: movies[i]._id,
					year: movies[i].myear,
					title: movies[i].mtitle,
					poster_path: movies[i].poster_path,
					overview: movies[i].overview,
					genre_ids: movies[i].genre_ids
				})
			}

			socket.emit('movies:list', {
				'data': data
			})
		})

		console.log('done')
	});

	// TRACK
	// add given to track list
	socket.on('series:track', function(input){
		console.log('series:track', input)

		if(input.action === 'remove'){
			console.log('removing', input.data.id, 'from track list')

			series.findOneAndRemove({ _id: input.data.id }, function(err, other){
				
				if(err){
					console.error(err);
				}
				
				console.log('done deleting', other)
			})
		}

		var addSeason = function(series, data){
			console.log('adding season', data.season)
			var ses = new season({
				season:data.season, 
				episode_count:data.episode_count
			})
			series.seasons.push(ses)
			series.save()
		}

		if(input.action === 'add'){
			series.findOne({ mid: input.data.mid }, function(err, result){
				console.log(err, result)

				if(err){
					console.error(err);
				}

				if(result === null){
					var s = new series(input.data)
					s.save(function(err, item){
						if(err){
							console.error('error', err)
						}else{
							console.log('item', item)
							
							addSeason(item, input.data)

							console.log('Added', s.mtitle+'('+s.myear+')', 'to watch list.')
							series.count({}, function(err, result){
								console.log('Count is '+result)
							})	
						}
					})
				}else{
					console.log('Series already exists.')
					
					var i = 0;
					var season_exists = false;
					for(i = 0; i < result.seasons.length; i++){
						if(result.seasons[i].season === input.data.season){
							season_exists = true;
						}
					}

					// console.log(result)
					if(!season_exists){
						addSeason(result, input.data)
					}else{
						console.log('Season', input.data.season, 'already exists.')
					}
				}

			})
		}
	})


	socket.on('movies:track', function(input){
		console.log('movies:track', input)

		if(input.action === 'remove'){
			console.log('removing', input.data.id, 'from track list')

			movie.findOneAndRemove({ _id: input.data.id }, function(err, other){
				
				if(err){
					console.error(err);
				}
				
				console.log('done deleting', other)
			})
		}

		if(input.action === 'add'){
			console.log('adding', input.data.mtitle, 'to track list')

			movie.findOne({ mid: input.data.mid }, function(err, result){
				// console.log('findOne')
				// console.log(err, result)
				// console.log('------')
				if(err){
					console.error(err);
				}

				// only add a given entry if it doesn't exist
				if(result === null){
					var m = new movie(input.data)
					m.save(function(err){
						if(err){
							console.error('error', err)
						}else{
							console.log('Added', m.mtitle+'('+m.myear+')', 'to watch list.')
							movie.count({}, function(err, result){
								console.log('Count is '+result)
							})	
						}
					})
				}else{
					console.log(input.data.mtitle, 'is already on the list')
				}
			});
		}

	});

	// DETAILS - seasons
	socket.on('series:details', function(input){
		tmdbs.details(input)
		.then(function(data){
			console.log(data)
			socket.emit('series:details', {
				'data':data
			})
		})
	})

	// FIND
	// list of series we want to discover
	socket.on('series:find', function(input){
		tmdbs.find(input)
		.then(function(data){
			console.log(data)
			socket.emit('series:find', {
				'data':data
			})
		})
	})

	// list of movies we want to discover
	socket.on('movies:find', function(input){
		tmdbm.find(input)
		.then(function(data){
			console.log(data)
			socket.emit('movies:find', {
				'data':data
			})
		})
	})

	// DISCOVER
	// list of series we want to discover
	socket.on('series:discover', function(input){
		tmdbs.discover(input)
		.then(function(data){
			console.log(data)
			socket.emit('series:discover', {
				'data':data
			})
		})
	})

	// list of movies we want to discover
	socket.on('movies:discover', function(input){
		tmdbm.discover(input)
		.then(function(data){
			console.log(data)
			socket.emit('movies:discover', {
				'data':data
			})
		})
	})

	// UPCOMING
	// list of upcoming movies
	socket.on('series:upcoming', function(input){
		tmdbm.upcoming(input)
		.then(function(data){
			// remove movies which are already being tracked

			// console.log('result', data)
			socket.emit('series:upcoming', {
				'data':data
			})
		})
	})

	socket.on('movies:upcoming', function(input){
		tmdbm.upcoming(input)
		.then(function(data){
			// remove movies which are already being tracked

			// console.log('result', data)
			socket.emit('movies:upcoming', {
				'data':data
			})
		})
	})
};