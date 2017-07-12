'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  // internal data
  mtitle: {
    type: String
  },
  mid: {
    type: Number
  },
  myear: {
  	type: Number
  },
  msize: {
    type: Number
  },
  
  // user details
  title: {
    type: String
  },
  release_date: {
    type: String
  },
  overview: {
    type: String
  },
  vote_average: {
    type: Number
  },
  backdrop_path: {
    type: String
  },
  poster_path: {
    type: String
  },
  movie_path: {
    type: String
  },
  genre_ids: {
    type: Array
  },

  // internal status 
  track: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  available: {
  	type: Boolean,
    default: false
  },  
  view: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Movies', MovieSchema)