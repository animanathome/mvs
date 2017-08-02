var express = require('express')
	, bodyParser = require('body-parser')
	, json = require('json')
	, http = require('http')
	, yts = require('./controls/yts.js')
	, oneom = require('./controls/oneom.js')
	, getIP = require('external-ip')();
 

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
var server = http.createServer(app);


/* Configuration */
// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '/public'));
app.set('port', 3000);

// if (process.env.NODE_ENV === 'development') {
	// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// }


app.post('/series', function(req, res){

	if(!req.body.title || !req.body.season || !req.body.episode){
		console.error('Missing parameters')
		
		res.json({error:'Missing title, season or episode parameter'})
		res.send()
		return
	}

	var title = req.body.title
	var season = req.body.season
	var episode = req.body.episode

	console.log('title:', title)
	console.log('season:', season)
	console.log('episode:', episode)

	oneom.getMagnetURI(title, season, episode)
	.then(function(result){
		// return oneom.downloadTorrent(result)
	})
	.then(function(result){
		console.log('Done downloading:', title, '- season:', season, '- episode:', episode)
		// update database
		var message = {
			title: title,
			season: season,
			episode: episode,
			update: {
				available:true,
				movie_path: result.item.path
			}
		}
		console.log('Sending update', message)
		// conn.emit('item:update', message)
		// res.send('searching movies')
		res.json(message);
		res.send()
	})
})

app.post('/movies', function(req, res){
	// console.log('post')
	// console.log('searching for', req)

	if(!req.body.title || !req.body.year){
		console.error('Missing parameters')
		
		res.json({error:'Missing title or year parameter'})
		res.send()
		return
	}

	console.log('Searching for', req.body.title+' ('+req.body.year+')')

	yts.getTorrent(req.body)
		.fail(function(err){
			console.error('ERROR:', err)
		})
		.then(function(result){
			// console.log('result', result.item.title)
			
			if(result !== undefined 
			&& result.data 
			&& result.data.movie_count > 0){
				console.log('Found torrent for', result.item.title+' ('+result.item.year+')')
				if(DOWNLOAD){
					return yts.downloadTorrent(result)
				}else{
					console.error('Download is disabled. Unable to download', result.item.title+' ('+result.item.year+')')
					return 
				}
			}else{
				// console.log('--------')
				// console.log(result)
				// console.log('--------')
				console.error('No torrent available yet for', req.body.title+' ('+req.body.year+')')
				return
			}
		})
		.fail(function(err){
			console.error('ERROR:', err)
		})
		.then(function(result){
			console.log('Done downloading', result.item.title+' ('+result.item.year+')')
			// update database
			var message = {
				id:result.item.id,
				update: {
					available:true,
					movie_path: result.item.path
				}
			}
			console.log('Sending update', message)
			// conn.emit('item:update', message)
			// res.send('searching movies')
			res.json(message);
			res.send()
		})

})

/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
