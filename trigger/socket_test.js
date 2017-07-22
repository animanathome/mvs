var io = require('socket.io-client');

var host = 'http://web:3001'
// console.log('host', host)
let socket = io(host)

socket.on('connect', function(){
	console.log('connect')

	socket.emit('movies:list')
});
socket.on('event', function(data){
	console.log('event')
});
socket.on('movies:list', function(data){
	console.log(data)
})
socket.on('disconnect', function(){
	console.log('disconnect')
});