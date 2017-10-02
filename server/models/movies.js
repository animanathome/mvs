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
  download_size: {
    type: Number
  },
  download_time: {
    type: Number
  },
  
  // tmdb details
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
  genre_ids: {
    type: Array
  },

  // server details
  movie_path: {
    type: String
  },

  // internal data
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