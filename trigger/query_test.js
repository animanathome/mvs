// sample command to query our search container

// curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3000/api/login


// http://pia:3000/movies?boem=me

var http = require('http');
var request = require('request');

// request
// .get('http://pia:3000/')
// .on('response', function(response) {
// 	// console.log(response)
// 	response.on('data', function (chunk) {
//     	console.log('BODY: ' + chunk)
//   	});
// })

request
.get('http://pia:3000/movies?boem=me')
.on('response', function(response) {
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

request
.post('http://pia:3000/movies?boe=me', {form:{boem:'boa'}})
.on('response', function(response){
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


// var options = {
//   host: 'pia',
//   port: 3000,
//   path: '/movies',
//   method: 'GET',
//   // json: true
// };

// console.log('sending request', options)
// http.request(options, function(res) {
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// });