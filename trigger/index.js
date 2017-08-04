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
    console.log('Public ip', ip);
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
		console.log(response)

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

var query_series_requests = function(){
	console.log('\tQuery_series_requests')
	let socket = io(host)
	// check if you have any content to look for
	socket.on('connect', function(){
		console.log('connect')
		socket.emit('series:list')
	});


	// get series details, determine season and episodes to find
	var i = 0;
	var data = [];
	var query_series = function(){
		// console.log('--------------------------')
		// console.log('query_series')
		// console.log('\tindex:', i)
		// console.log('\tlength:', data.length)
		// console.log('\tmid:', data[i].mid)

		socket.emit('series:list_details', { 
			mid:data[i].mid 
		})
		
		socket.once('series:list_details', function(result){
			
			console.log('--------------------------')
			console.log('list_details')
			console.log(i, result)

			// console.log('seasons', result.data.seasons)

			var j, k, season, episodes, name, id;
			
			name = result.data.name;
			id = result.data._id;
			for(j = 0; j < result.data.seasons.length; j++){
				season = result.data.seasons[j].season;
				episodes = result.data.seasons[j].track;

				for(k = 0; k < 1; k++){
				// for(k = 0; k < episodes; k++){
					// console.log('series:', name, '- season:', season, '- episode', k+1)
					search_series_requests({
						id: id,
						name: name,
						season: season,
						episode: k+1
					})
					.then(function(result){
						console.log(result)
						if(result.update){
							socket.emit('series:update', result)
						}
					})
				}
			}

			if(i < data.length-1){
				i += 1;
				query_series()
			}
		})
	}

	// get a list of series we're looking for
	socket.once('series:list', function(result){
		console.log('got', result.data)

		// look for each series, one at a time
		if(result.data.length > 0){
			data = result.data;
			query_series()
		}	
	})
}

// request the content we need to look for
var query_requests = function(){
	console.log('\tQuery_requests')
	
	let socket = io(host)
	// check if you have any content to look for
	socket.on('connect', function(){
		console.log('connect')
		socket.emit('movies:list')
	});

	// if we do, pass each item to search
	socket.once('movies:list', function(result){
		console.log('got', result.data)

		var id,
			i = 0,
			ds = result.data.length,
			delay = 100;

		// make sure we have content to go over
		if(ds == 0){
			return
		}

		function run_send(){
			return setInterval(function(){
				console.log('\tSearching for', result.data[i].title+'('+result.data[i].year+')')	
				
				search_movie_requests({
					id:result.data[i].id,
					title:result.data[i].title,
					year:result.data[i].year
				})
				.then(function(result){
					// update database
					if(result.update){
						socket.emit('movies:update', result)
					}
				})
				.fail(function(err){
					console.error(err)
				})

				i+=1
				if(i >= ds){
					console.log('done')
					clearInterval(id)
				}
			}, delay)
		}
		id = run_send();

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
	query_series_requests()
});

module.exports = app;
