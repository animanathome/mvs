var movies = require('../controls/tmdb.js')

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

	socket.on('movies:upcoming', function(input){
		movies.upcoming(input)
		.then(function(data){			
			socket.emit('movies:upcoming', {
				'data': data
			})
		})
	})
};