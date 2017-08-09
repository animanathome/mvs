var tmdbm = require('../controls/tmdbm.js')
var tmdbs = require('../controls/tmdbs.js')
var _series = require('../controls/series.js')
var _movies = require('../controls/movies.js')

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

		_movies.get(data)
		.then(function(result){
			socket.emit('item:getByName', {
				'data': result
			})
		})
		.fail(function(err){
			socket.emit('item:getByName', {
				'error': err
			})	
		})
	})

	// update a given entry
	socket.on('item:update', function(data){
		console.warn('Deprecated, use series or movies instead.')
	})


	// // SERIES
	// socket.on('series:update', function(input){

	// 	console.log('series:update', input)
		
	// 	var mid = input.data.mid;

	// 	if(input.action === 'addSeason'){
	// 		_series.addSeason(input.data)
	// 		.then(function(){
	// 			return _series.details(input.data)
	// 		})
	// 		.then(function(data){
	// 			socket.emit('series:list_details', {
	// 			'data': data})
	// 		})
	// 	}

	// 	if(input.action === 'removeSeason'){
	// 		// TODO: when we remove the last season, we also need to remove the actual series
	// 		_series.removeSeason(input.data)
	// 		.then(function(){
	// 			return _series.details(input.data)
	// 		})
	// 		.then(function(data){
	// 			socket.emit('series:list_details', {
	// 			'data': data})
	// 		})
	// 	}

	// 	if(input.action === 'addEpisode'){
	// 		_series.addEpisode(input.data)
	// 	}

	// 	if(input.action === 'removeEpisode'){
	// 		_series.removeEpisode(input.data)
	// 	}

	// 	if(input.action === 'updateEpisode'){
	// 		_series.updateEpisode(input.data)
	// 	}
	// })

	socket.on('series:watch', function(input){
		console.log('series:watch', input)

		if(input.action === 'list'){
			_series.list({
				track:true,
				available:true
			})
			.then(function(data){
				socket.emit('series:watch', {
					action:'list',
					data: data
				})
			})
		}
	})
	
	// socket.on('series:list_episodes', function(input){
	// 	_series.listEpisodes(input)
	// 	.then(function(data){
	// 		console.log(data)
	// 		socket.emit('series:list_episodes', {
	// 			'data': data
	// 		})
	// 	})
	// })

	// socket.on('series:list_details', function(input){
	// 	console.log('series:list_details', input)
		
	// 	_series.details(input)
	// 	.then(function(data){
	// 		socket.emit('series:list_details', {
	// 			'data': data
	// 		})	
	// 	})
	// })

	// socket.on('series:list', function(){
	// 	console.log('series:list')

	// 	_series.list()
	// 	.then(function(data){
	// 		socket.emit('series:list', {
	// 			'data': data
	// 		})
	// 	})
	// })

	socket.on('series:track', function(input){
		console.log('series:track', input)

		if(input.action === 'list'){
			_series.list()
			.then(function(data){
				socket.emit('series:track', {
					action:'list', 
					data: data
				})
			})
		}

		if(input.action === 'list_details'){
			_series.details(input.data)
			.then(function(data){
				socket.emit('series:track', {
					action:'list_details',
					data: data
				})	
			})
			.fail(function(err){
				socket.emit('series:track', {
					action:'redirect',
					err:err
				})
			})
		}

		if(input.action === 'remove'){
			_series.remove(input.data)
			.then(function(){
				return _series.list()
			})
			.then(function(data){
				socket.emit('series:track', {
					action:'list', 
					data: data
				})
			})
		}

		if(input.action === 'removeSeason'){
			_series.removeSeason(input.data)
			.then(function(){
				return _series.details(input.data)
			})
			.then(function(data){
				socket.emit('series:track', {
					action:'list_details',
					data: data
				})
			})
			.fail(function(err){
				console.warn(err)
				socket.emit('series:track', {
					action:'redirect',
					err: err
				})
			})
		}

		if(input.action === 'add'){
			_series.add(input.data)
			.then(function(){
				return _series.list()
			})
			.then(function(data){
				socket.emit('series:track', {
					action:'list',
					'data': data
				})
			})
		}
	})

	// socket.on('series:details', function(input){
	// 	tmdbs.details(input)
	// 	.then(function(data){
	// 		console.log(data)
	// 		socket.emit('series:details', {
	// 			'data':data
	// 		})
	// 	})
	// })

	// list of series we want to discover
	socket.on('series:find', function(input){
		console.log('series:find', input)
		
		if(input.action === 'list'){
			tmdbs.find(input.data)
			.then(function(data){
				console.log(data)
				socket.emit('series:find', {
					action:'list',
					data:data
				})
			})
		}

		if(input.action === 'list_details'){
			tmdbs.details(input.data)
			.then(function(data){
				console.log(data)
				socket.emit('series:find', {
					action:'list_details',
					data:data
				})
			})
		}

	})

	// list of series we want to discover
	socket.on('series:discover', function(input){
		console.log('series:discover', input)
		
		if(input.action === 'list'){
			tmdbs.discover(input.data)
			.then(function(data){
				console.log(data)
				socket.emit('series:discover', {
					action:'list',
					data:data
				})
			})
		}
	})
	
	// list of upcoming movies
	socket.on('series:upcoming', function(input){
		console.log('series:upcoming', input)

		if(input.action === 'list'){
			tmdbm.upcoming(input)
			.then(function(data){
				// remove movies which are already being tracked

				// console.log('result', data)
				socket.emit('series:upcoming', {
					action:'list',
					data:data
				})
			})
		}
	})

	// list of movies which are available
	socket.on('movies:watch', function(input){
		console.log('movies:watch', input)

		if(input.action === 'list'){
			_movies.list({
				track:true, 
				available:true
			})
			.then(function(result){
				socket.emit('movies:watch', {
					action:'list',
					data: result
				})
			})
		}
	});

	socket.on('movies:track', function(input){
		console.log('movies:track', input)

		if(input.action === 'list'){
			_movies.list({
				track:true, 
				available:false
			})
			.then(function(result){
				socket.emit('movies:track', {
					action: 'list',
					data: result
				})
			})
		}

		if(input.action === 'remove'){
			console.log('removing', input.data.id, 'from track list')

			_movies.remove(input)
			.fail(function(err){
				console.error(err)
			})
			.then(function(){
				console.log('finished removing movie', input.data.id)
				return _movies.list({
					track:true, 
					available:false
				})
			})
			.then(function(result){
				socket.emit('movies:track', {
					action: 'list',
					data: result
				})
			})
		}

		if(input.action === 'update'){
			console.log('updating', input.data.id)

			_movies.update(input.data)
			.fail(function(){
				console.log('unable to update', data.id)
			})
			.then(function(){
				console.log('finished updating', data.id)
				return _movies.list({
					track:true, 
					available:false
				})
			})
			.then(function(result){
				socket.emit('movies:track', {
					action: 'list',
					data: result
				})
			})
		}

		if(input.action === 'add'){
			console.log('adding', input.data.mtitle, 'to track list')

			_movies.add(input)
			.fail(function(err){
				console.error(err)
			})
			.then(function(){
				console.log('finished adding movie', input.data.id)
				return _movies.list({
					track:true, 
					available:false
				})
			})
			.then(function(result){
				socket.emit('movies:track', {
					action:'list',
					data: result
				})
			})
		}

	});

	// list of movies we want to discover
	socket.on('movies:find', function(input){

		if(input.action === 'list'){
			tmdbm.find(input.data)
			.then(function(data){
				console.log(data)
				socket.emit('movies:find', {
					action:'list',
					data:data
				})
			})
		}

	})

	// DISCOVER
	// list of movies we want to discover
	socket.on('movies:discover', function(input){
		
		if(input.action === 'list'){
			tmdbm.discover(input.data)
			.then(function(data){
				console.log(data)
				socket.emit('movies:discover', {
					action:'list',
					data:data
				})
			})
		}
	})

	// UPCOMING
	socket.on('movies:upcoming', function(input){
		tmdbm.upcoming(input.data)
		.then(function(data){
			// remove movies which are already being tracked

			// console.log('result', data)
			socket.emit('movies:upcoming', {
				'data':data
			})
		})
	})
};