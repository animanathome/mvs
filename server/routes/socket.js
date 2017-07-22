var tmdb = require('../controls/tmdb.js')
var movie = require('../models/movies.js')

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
		console.log('item:update', {_id:data.id}, {$set:data.update})
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

	// add the given to the track list
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

	// list of movies we want to discover
	socket.on('movies:find', function(input){
		tmdb.find(input)
		.then(function(data){
			console.log(data)
			// remove the list of movies we're already tracking or have
			// remove movies that don't have a poster
			// remove horror + erotica movies
			// remove B movies???
			// remove documentaries
			// add title + actors + score
			socket.emit('movies:find', {
				'data':data
			})
		})
	})

	// list of movies we want to discover
	socket.on('movies:discover', function(input){
		tmdb.discover(input)
		.then(function(data){
			console.log(data)
			// remove the list of movies we're already tracking or have
			// remove movies that don't have a poster
			// remove horror + erotica movies
			// remove B movies???
			// remove documentaries
			// add title + actors + score
			socket.emit('movies:discover', {
				'data':data
			})
		})
	})

	// list of upcoming movies
	socket.on('movies:upcoming', function(input){
		tmdb.upcoming(input)
		.then(function(data){
			// remove movies which are already being tracked

			// console.log('result', data)
			socket.emit('movies:upcoming', {
				'data':data
			})
		})
	})
};