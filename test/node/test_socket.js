var express = require('express')
	, http = require('http')
	, io = require('socket.io-client')

var app = express();
var server = http.createServer(app);
app.set('port', 3002);
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// var host = 'http://web:3001'
var host = 'http://127.0.0.1:3001'

var test = function(){
	console.log('running test')
	let socket = io(host)

	var add_series = {
		action:'add',
		data:{
			mid: 1399,
			myear: 2011,
			title: 'Game of Thrones',
			mtitle: 'Game of Thrones',
			backdrop_path: '/aKz3lXU71wqdslC1IYRC3yHD6yw.jpg',
			poster_path: [ '/gwPSoYUHAKmdyVywgLpKKA4BjRr.jpg' ],
			vote_average: 8.1,
			track: true,
		}
	}

	var add_episode = {
		action:'addEpisode',
		data:{
			id: '5980bed945c9ba001169eba9',
			// name: 'Game of Thrones',
			season: '7',
			episode: '1',
			path: '/series/Game of Thrones/7/1/movie.mp4'
		}
	}

	var remove_episode = {
		action:'removeEpisode',
		data:{
			id: '5980bed945c9ba001169eba9',
			// name: 'Game of Thrones',
			season: '7',
			episode: '1'
		}
	}

	var update_episode = {
		action:'updateEpisode',
		data:{
			_id:'598393c6b8048f00116d4996',
			season: 7,
			episode: 1,
			update: {
				available:true,
				track:false
			}
		}
	}

	var add_season = {
		action:'addSeason',
		data:{
			// name: 'Game of Thrones',
			id: '5980bed945c9ba001169eba9',
			season: '7',
			episode_count: '12'
		}	
	}

	var remove_season = {
		action:'removeSeason',
		data:{
			// name: 'Game of Thrones',
			id: '5980bed945c9ba001169eba9',
			season: '6'
		}	
	}


	socket.on('connect', function(){
		console.log('connect')

		socket.emit('series:update', update_episode)
		socket.emit('series:list_episodes', {track:true})

	// 	setTimeout(function(){
	// 		socket.emit('series:update', remove_episode)
	// 	}, 100)

	// 	setTimeout(function(){
	// 		socket.emit('series:update', add_season)
	// 	}, 200)

	// 	setTimeout(function(){
	// 		socket.emit('series:update', remove_season)
	// 	}, 300)
	});
}


server.listen(app.get('port'), function (){
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
	test()
});

module.exports = app;