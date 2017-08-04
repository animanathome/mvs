var express = require('express')
	, http = require('http')
	, cron = require('node-schedule')
	, io = require('socket.io-client')
	, request = require('request')
	, q = require("q")
	, getIP = require('external-ip')();

console.log('running')

getIP((err, ip) => {
    if (err) {
        // every service in the list has failed 
        throw err;
    }
    console.log('---------------')
    console.log('REQUEST - Public ip', ip);
    console.log('---------------')
});


var app = express();
var server = http.createServer(app);

var host = 'http://web:3001'

/* Configuration */
// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '/public'));
app.set('port', 3000);

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Trigger Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

// look for the given item
// movie 
// {
// 	id:2323,
// 	title:Aliens
// 	year:2017
// }
var search_movie_requests = function(movie){
	console.log('\tSearch_movie_requests', movie)	

	var deferred = q.defer();

	request
	.post('http://pia:3000/movies', {form:movie})
	.on('response', function(response){
		console.log('got result back')
		// console.log(response)

		var result = ''
		response.on('data', function (chunk) {
	    	// console.log('BODY: ' + chunk)
	    	result+=chunk
	  	});

	  	response.on('end', function(){
	  		// console.log('done')
	  		result=JSON.parse(result)
	  		deferred.resolve(result);
	  	})  	
	})
	.on('error', function(err){
		console.log('Error', err)
	})

	return deferred.promise;
}

// series
// {
//	name: 'Game of Thrones',
//	season: 7, 
//	episode: 10
// }
var search_series_requests = function(series){

	var deferred = q.defer();

	request
	.post('http://pia:3000/series', {form:series})
	.on('response', function(response){
		// console.log(response)

		var result = ''
		response.on('data', function (chunk) {
	    	// console.log('BODY: ' + chunk)
	    	result+=chunk
	  	});

	  	response.on('end', function(){
	  		// console.log('done')
	  		result=JSON.parse(result)
	  		deferred.resolve(result);
	  	})  	
	})
	.on('error', function(err){
		console.log('Error', err)
	})

	return deferred.promise;
}

let socket = io(host, {
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': 10
})

socket.on('connect', function(){
	console.log('connect')
});

socket.on('disconnect', function () {
	console.log('disconnect');
});

var query_movies_requests = function(){
	console.log('query_movies_requests')


	if(!socket.connected){
		console.error('Unable to send request. Socket is not connected')
	}

	// socket.on('connect', function(){
	// 	console.log('connect')
		socket.emit('movies:list')
	// });

	// socket.on('disconnect', function () {
	// 	console.log('disconnect');
	// });

	// if we do, pass each item to search
	socket.once('movies:list', function(result){
		console.log('result', result)

		// socket.disconnect();

		var i;
		for(i = 0; i < result.data.length; i++){
			console.log('Sending download request for', result.data[i])
			search_movie_requests({
				id:result.data[i].id,
				title:result.data[i].title,
				year:result.data[i].year,
			})
			.then(function(data){
				console.log('done downloading')
				console.log('result', data)

				var payload = {
					id:data.item.id,
					update:{
						movie_path:data.item.path,
						downloadTime:data.item.downloadTime,
						track: false,
						available: true
					}
				}
				console.log('sending payload', payload)
				socket.emit('movies:update', payload)
			})
		}
	})
}

var query_series_requests = function(){
	console.log('query_series_requests')

	let socket = io(host)
	
	socket.on('connect', function(){
		console.log('connect')
		socket.emit('series:list_episodes', {track:true, available:false})
	});

	socket.on('disconnect', function () {
		console.log('disconnect');
	});

	socket.once('series:list_episodes', function(result){
		console.log('result', result)

		socket.disconnect();

		var i;
		for(i = 0; i < result.data.length; i++){
			console.log('Sending download request for', result.data[i])
			search_series_requests(result.data[i])
			.then(function(data){
				console.log('done downloading')
				console.log(data)
			})
		}
	})
}

// query_requests();
// query_series_requests()
var job_run_count = 1;

// search for new content every *
var job = cron.scheduleJob('*/2 * * * *', function(){
	console.log('-------------------------------------------------')
	console.log('Running cron job for the', job_run_count++, 'time');
	// query_requests();
	// query_series_requests()
	query_movies_requests()
});

module.exports = app;
