var tmdbm = require('../controls/tmdbm.js')
var tmdbs = require('../controls/tmdbs.js')
var _series = require('../controls/series.js')

var movie = require('../models/movies.js')
// var series = require('../models/series.js')
// var Season = require('../models/season.js')
// var Episode = require('../models/episode.js')

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

	socket.on('series:update', function(input){

		console.log('series:update', input)
		
		if(input.action === 'addSeason'){
			_series.addSeason(input.data)
		}

		if(input.action === 'removeSeason'){
			// var data = input.data
			_series.removeSeason(input.data)
		}

		if(input.action === 'addEpisode'){
			_series.addEpisode(input.data)
		}

		if(input.action === 'removeEpisode'){
			_series.removeEpisode(input.data)
		}

		if(input.action === 'updateEpisode'){
			_series.updateEpisode(input.data)
		}
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
	socket.on('series:list_episodes', function(input){
		_series.listEpisodes(input)
		.then(function(data){
			console.log(data)
			socket.emit('series:list_episodes', {
				'data': data
			})
		})
	})

	socket.on('series:list_details', function(input){
		_series.details(input)
		.then(function(data){
			socket.emit('series:list_details', {
				'data': data
			})	
		})
	})

	socket.on('series:list', function(){
		console.log('series:list')

		_series.list()
		.then(function(data){
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
			_series.remove(input.data)
		}

		if(input.action === 'add'){
			_series.add(input.data)
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