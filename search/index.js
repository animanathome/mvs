var express = require('express');
var http = require('http');
var io = require('socket.io-client');
var schedule = require('node-schedule');

var serverUrl = 'http://localhost:3001';
var conn = io.connect(serverUrl);

var yts = require('./controls/yts.js');

conn.on('disconnect', function(){
	console.log('disconnect')
});

conn.on('init', function(){
	console.log('init')

	conn.emit('movies:list', {})
});

conn.on('movies:list', function(result){
	// console.log(result.data.length)
	// console.log(result)

	// TODO: add year when storing which movie we want to track/view
	for(var i = 0; i < result.data.length; i++){
		// console.log(i, result.data[i].title)
		yts.getTorrent(result.data[i].title)
		.fail(function(err){
			// console.error(err)
		})
		.then(function(result){
			return yts.downloadTorrent(result)
		})
		.fail(function(err){
			console.error('ERROR: ', err)
		})
		.then(function(){
			console.log('done downloading')

			// update database so we know, we now can watch this content
			// pass on content id
		})

	}

})

var app = express();
var server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// console.log('starting')

// var job = schedule.scheduleJob('*/1 * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });

module.exports = app;