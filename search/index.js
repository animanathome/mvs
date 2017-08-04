var express = require('express')
	, bodyParser = require('body-parser')
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
    console.log('Public ip', ip);
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
	console.log('download series', job.data)

	download.series(job.data)
	.then(function(result){
		done(result)
	})
})

queue.process('download movie', 1, function(job, done){
	console.log('download movie', job.data)

	download.movie(job.data)
	.then(function(result){
		done(result)
	})
})

app.post('/series', function(req, res){
	console.log('POST - series', req.body)

	var job = queue.create('download series', req.body)
	job.save()
	job.on('complete', function(result){
	  	console.log('Job completed with data ', result);
	  	res.json(result);
		res.send()
	}).on('failed', function(err){
  		console.log('Job failed', err);
  	});
})

app.post('/movies', function(req, res){
	// console.log('post')
	// console.log('searching for', req)

	var job = queue.create('download movie', req.body)
	job.save()
	job.on('complete', function(result){
	  	console.log('Job completed with data ', result);
	  	res.json(result);
		res.send()
	}).on('failed', function(err){
  		console.log('Job failed', err);
  	});
})

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
