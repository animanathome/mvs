var express = require('express')
	, Q = require("q")
	, bodyParser = require('body-parser')
	, request = require('request')
	, json = require('json')
	, http = require('http')
	, download = require('./controls/download.js')
	, kue = require('kue')
	, getIP = require('external-ip')()
 

getIP((err, ip) => {
    if (err) {
        // every service in the list has failed 
        throw err;
    }
    console.log('---------------')
    console.log('DOWNLOAD - Public ip', ip);
    console.log('---------------')
});

console.log('running')

var DOWNLOAD = false

var app = express();
app.use(express.bodyParser());
app.use(kue.app)
app.set('port', 3000);

var server = http.createServer(app);
var queue = kue.createQueue();

queue.process('download series', 1, function(job, done){
	var data = job.data;
	console.log('Download series', data)
	
	var start = Date.now()

	download.series(data)
	.then(function(result){
		result.item.downloadTime = Date.now() - start;
		console.log('\tdone', result)
		done(null, result)
	})
	.fail(function(err){
		console.log('\tfailed', err)
		done(err)
	})
})

queue.process('download movie', 1, function(job, done){
	var data = job.data;
	console.log('Download movie', data)

	var start = Date.now()
	download.movie(data)
	.then(function(result){
		result.item.downloadTime = Date.now() - start;
		console.log('\tdone', result)
		done(null, result)
	})
	.fail(function(err){
		console.log('\tfailed', err)
		done(err)
	})
})

queue.on('job enqueue', function(id, type){
  console.log( 'Job %s got queued of type %s', id, type );
}).on('job complete', function(id, result){
  kue.Job.get(id, function(err, job){
    if (err) return;
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
}).on( 'error', function( err ) {
	console.log( 'Oops... ', err );
});

reset_queue = function(){
	console.log('reset_queue')

	var remove_active = function(){
		// Remove all active jobs
		queue.active(function(err, ids){
			console.log(ids.length, 'active jobs')
			ids.forEach( function( id ) {
				kue.Job.get( id, function( err, job ) {
					if(job === undefined){
						return
					}
					job.inactive(function(){
						job.remove( function(){
			      			console.log( '\tremoved active job', job.id );
			    		});
					})
				});
			});
		})
	}

	var remove_inactive = function(){
		// Remove all inactive jobs
		queue.inactive(function(err, ids){
			console.log(ids.length, 'inactive jobs')
			ids.forEach( function( id ) {
				kue.Job.get( id, function( err, job ) {
					if(job === undefined){
						return
					}

					job.remove( function(){
		      			console.log( '\tremoved inactive job', job.id );
		    		});
				});
			});
		})
	}

	remove_active()
	remove_inactive()
}

reset_queue()


var update_series = function(data){
	console.log('update_series', data)

	request
	.post('http://trigger:3000/series', {form:data})
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
	  		console.log(result)
	  	})  
	})
}

var update_movies = function(data){
	console.log('update_movies', data)

	request
	.post('http://trigger:3000/movies', {form:data})
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
	  		console.log(result)
	  	})  
	})
}

app.post('/series', function(req, res){
	console.log('Creating series download job for', req.body)

	var job = queue.create('download series', req.body)
	job.removeOnComplete( true ).save()
	.on('complete', function(result){
	  	console.log('Job completed with data ', result);
	  	update_series(result)
	}).on('failed', function(err){
  		console.log('Job failed', err);
  	});
  	
  	res.json({message:'Job added'});
	res.send()
})

app.post('/movies', function(req, res){
	// console.log('post')
	// console.log('searching for', req)
	console.log('Creating movie download job for', req.body)

	var job = queue.create('download movie', req.body)
	job.removeOnComplete( true ).save()
	.on('complete', function(result){
	  	console.log('Job completed with data ', result);
	  	update_movies(result)
	}).on('failed', function(err){
  		console.log('Job failed', err);
  	});
  	
  	res.json({message:'Job added'});
	res.send()
})

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
