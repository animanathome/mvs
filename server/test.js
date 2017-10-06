// https://github.com/Automattic/mongoose/issues/5399

// var mongoose = require('mongoose');
// var movie = require('./models/movies.js')

// // console.log('connecting')
// var db = mongoose.connect('mongodb://mongo:27017/mvs')
// console.log('connection status:', mongoose.connection.readyState);
// movie.count({}, function(err, result){
//   console.log('Count is '+result)
// })  

// var input = {
//   data:{
//     mtitle:'test',
//     mid:2121333,
//     myear:2016
//   }
// }

// var m = new movie(input.data)
// m.save(function(err){
//   if(err){
//     console.error('error', err)
//   }else{
//     console.log('done adding', m.myear, m.mtitle)
//     movie.count({}, function(err, result){
//       console.log('Count is '+result)
//     })  
//   }
// })


// DOES NOT WORK
// 
// var mongoose = require('mongoose');
// var movie = require('./models/movies.js')
// mongoose.connect('mongodb://mongo:27017/mvs', { useMongoClient: true }, function(err){  
//   if(err){
//     console.error(err)
//   }else{
//     console.log('successfully connected to mongo database')
//     console.log('connection status:', mongoose.connection.readyState);
    
//     console.log('getting number of movies:')
//     movie.count({}, function(err, result){
//       console.log('error', err)
//           console.log('count is '+result)
//       })
//   }
// });

var tmdbs = require('./controls/tmdbs.js')

// discover series
// tmdbs.discover({sort:'pd', year:2017})
// .then(function(res){
//   console.log('result', res)
// })

tmdbs.season_details({tv_id:1399, season_number:7})
.then(function(res){
  // console.log('result', typeof(res))
  
  if(typeof(res) === 'string'){
    res = JSON.parse(res)
  }
  
  for(i = 0; i < res.episodes.length; i++){
    console.log(i, res.episodes[i].name, res.episodes[i].air_date)
  }
})
