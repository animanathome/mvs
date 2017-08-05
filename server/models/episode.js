'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EpisodeSchema = new Schema({
  download_size: {
  	type: Number
  },
  // how long did it take to download the given file
  download_time: {
  	type: Number
  },
  // can be 720, 1080 or 4000
  resolution: {
  	type: Number
  },
  episode:{
    type: Number
  },
  // path to file
  movie_path: {
    type: String
  },
  // are we actively tracking 
  track: {
    type: Boolean,
    default: false
  },
  // is there a torrent available
  torrent: {
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
}, {_id: false})

module.exports = mongoose.model('Episode', EpisodeSchema)