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
var mongoose = require('mongoose');
var movie = require('./models/movies.js')
mongoose.connect('mongodb://mongo:27017/mvs', { useMongoClient: true }, function(err){  
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