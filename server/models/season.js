'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EpisodeSchema = require('./episode.js')

var SeasonSchema = new Schema({
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
  season:{
    type: Number
  },
  episode_count:{
    type: Number
  },
  episodes: [EpisodeSchema.schema]
},{_id: false})

module.exports = mongoose.model('Season', SeasonSchema)