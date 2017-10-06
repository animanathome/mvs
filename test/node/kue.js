// https://stackoverflow.com/questions/8754304/redis-connection-to-127-0-0-16379-failed-connect-econnrefused
// redis-server
var kue = require('kue')
  , queue = kue.createQueue();

var jobs = kue.createQueue();


jobs.process( 'video conversion', 1, function ( job, done ){
	console.log('video conversion', job.data)

	done()
})

setInterval(function(){
	jobs.create( 'video conversion', {
		user: 1, frames: 200
	}).save();
}, 1000)

