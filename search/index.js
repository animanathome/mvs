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
	console.log(result.data.length)
	console.log(result)

	// TODO: add year when storing which movie we want to track/view
	for(var i = 0; i < result.data.length; i++){
		console.log(i, result.data[i].title, result.data[i].year)
		
		yts.getTorrent(result.data[i])
		.fail(function(err){
			// console.error(err)
		})
		.then(function(result){
			return yts.downloadTorrent(result)
		})
		.fail(function(err){
			console.error('ERROR: ', err)
		})
		.then(function(result){
			console.log('done downloading', result.item)
			// update database
			var message = {
				id:result.item.id,
				update: {
					available:true,
					path: result.item.path
				}
			}
			console.log('sending update', message)
			conn.emit('item:update', message)
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