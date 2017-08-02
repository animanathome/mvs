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
var search_requests = function(movie){
	console.log('\tSearch_requests', movie)

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

var query_series_requests = function(){
	console.log('\tQuery_series_requests')
	let socket = io(host)
	// check if you have any content to look for
	socket.on('connect', function(){
		console.log('connect')
		socket.emit('series:list')
	});


	// if we do, pass each item to search
	var i = 0;
	var data = [];
	var query_series = function(){
		console.log('--------------------------')
		console.log('query_series')
		console.log('\tindex:', i)
		console.log('\tlength:', data.length)
		console.log('\tmid:', data[i].mid)

		socket.emit('series:list_details', {mid:data[i].mid})
		
		socket.once('series:list_details', function(result){
			
			console.log('--------------------------')
			console.log('list_details')
			console.log(i, result)

			var j = 0; 
			for(j = 0; j < result.length; j++){
				console.log('\t', j, result[j])
			}

			if(i < data.length-1){
				i += 1;
				query_series()
			}
		})
	}

	socket.once('series:list', function(result){
		console.log('got', result.data)

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
				
				search_requests({
					id:result.data[i].id,
					title:result.data[i].title,
					year:result.data[i].year
				})
				.then(function(result){
					// update database
					if(result.update){
						socket.emit('item:update', result)
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

var job_run_count = 1;

// search for new content every *
var job = cron.scheduleJob('*/2 * * * *', function(){
	console.log('-------------------------------------------------')
	console.log('Running cron job for the', job_run_count++, 'time');
	// query_requests();
	query_series_requests()
});

module.exports = app;
