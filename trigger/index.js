var express = require('express')
	, http = require('http')
	, cron = require('node-schedule')
	, bodyParser = require('body-parser')
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
app.use(express.bodyParser());
var server = http.createServer(app);

// var host = 'http://web:3001'

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

var query_movies_requests = function(){
	console.log('query_movies_requests')

	var deferred = q.defer();

	// get
	request
	.get({
		url:'http://web:3001/movies',
		json:{
			'action':'list'
		}
	})
	.on('error', function(err){
		console.log('Error', err)
	})
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

	return deferred.promise;
}

// series
// {
//	name: 'Game of Thrones',
//	season: 7, 
//	episode: 10
// }
var search_series_requests = function(series){
	console.log('search_series_requests', series)

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
	console.log('query_series_requests')

	var deferred = q.defer();

	// get
	request
	.get({
		url:'http://web:3001/series',
		json:{
			'action':'list_episodes'
		}
	})
	.on('error', function(err){
		console.log('Error', err)
	})
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

	return deferred.promise;
}

app.post('/series', function(req, res){
	console.log('Finished downloading series', req.body)
	
	var data = req.body;
	var payload = {
		'action':'update_episode',
		'data': {
			_id:data.item._id,
			season:data.item.season,
			episode:data.item.episode,
			update:{
				movie_path:data.item.path,
				download_time:data.item.download_time,
				track: false,
				available: true
			}
		}
	}

	// set
	request.post({
		url:'http://web:3001/series',
		json:payload
	}, function(req, res){
		console.log('done')
		res.end();
	})
})

app.post('/movies', function(req, res){
	console.log('Finished downloading movie', req.body)

	var data = req.body;
	var payload = {
		action:'update',
		data:{
			id:data.item.id,
			update:{
				movie_path:data.item.path,
				download_time:data.item.download_time,
				track: false,
				available: true
			}
		}
	}

	// set
	request.post({
		url:'http://web:3001/movies',
		json:payload
	}, function(req, res){
		console.log('done')
		res.end();
	})
})

// TODO:
// 1. setup restfull API between trigger and search
// 		trigger -> search to request a search
// 		search -> trigger to return the result of a search 
// 2. launch a initial search the moment the item is added
//    if not found, add to the queue every night at midnight

var job_run_count = 1;

// search for new content every *
var job = cron.scheduleJob('* */1 * * *', function(){
	console.log('-------------------------------------------------')
	console.log('Running cron job for the', job_run_count++, 'time');

	// series
	query_series_requests()
	.then(function(result){
		// console.log(result)
		var i = 0;
		for(i = 0; i < result.length; i++){
			search_series_requests(result[i])
		}
	})

	// movies
	query_movies_requests()
	.then(function(result){
		console.log(result)
		var i;
		for(i = 0; i < result.length; i++){
			search_movie_requests({
				id:result[i].id,
				title:result[i].title,
				year:result[i].year
			})
		}
	})

});

module.exports = app;
