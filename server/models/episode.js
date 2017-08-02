'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EpisodeSchema = new Schema({
  episode:{
    type: Number
  },
  episode_path: {
    type: String
  },
}, {_id: false})

module.exports = mongoose.model('Episode', EpisodeSchema)