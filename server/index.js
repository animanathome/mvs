var express = require('express');
var http = require('http');
var socket = require('./routes/socket.js');
var mongoose = require('mongoose');

// Movie = require('./models/movies.js')

// https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
mongoose.connect('mongodb://localhost/mvs');

var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', 3001);

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
