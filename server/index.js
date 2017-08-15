var express = require('express');
var bodyParser = require('body-parser')
var http = require('http');
var socket = require('./routes/socket.js');
var routes = require('./routes/routes.js');
var mongoose = require('mongoose');

movie = require('./models/movies.js')

// https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
// mongoose.connect('mongodb://localhost/mvs');
mongoose.connect('mongodb://mongo:27017/mvs', function(err){	
	if(err){
		console.error(err)
	}else{
		console.log('successfully connected to mongo database')
		console.log('connection status:', mongoose.connection.readyState);
		
		console.log('getting number of movies:')
		movie.count({}, function(err, result){
			console.log('error', err)
      		console.log('count is '+result)
    	})
	}
});

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var server = http.createServer(app);

/* Configuration */
// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '/public'));
app.set('port', 3001);

// if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// }

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;

// get data
app.get('/series', function(req, res){
	console.log('series get request', req.body)

	routes.getSeries(req.body)
	.then(function(result){
		console.log(result)
		res.json(result);
		// res.send()
	})
	.fail(function(err){
		console.warn(err)
		res.json({err:err})
	})
})

// set data
app.post('/series', function(req, res){
	console.log('series set request', req.body)

	routes.setSeries(req.body)
	.then(function(result){
		console.log('successfully completed request')
		res.json({res:'completed request'})
	})
	.fail(function(err){
		console.log('failed to complete request')
		console.warn(err)
		res.json({err:'failed request'})
	})
})

// get data
app.get('/movies', function(req, res){
	console.log('movies get request', req.body)

	routes.getMovies(req.body)
	.then(function(result){
		console.log(result)
		res.json(result);
		// res.send();
	})
	.fail(function(err){
		console.warn(err)
		res.json({err:err})
	})
})

// set data
app.post('/movies', function(req, res){
	console.log('movies set request', req.body)

	routes.setMovies(req.body)
	.then(function(result){
		console.log('successfully completed request')
		console.log(result)
		res.json({res:'completed request'})
	})
	.fail(function(err){
		console.log('failed to complete request')
		console.warn(err)
		res.json({err:err})
	})
})
