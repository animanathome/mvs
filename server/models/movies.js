'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  mtitle: {
    type: String
  },
  mid: {
    type: Number
  },
  myear: {
  	type: Number
  },
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
  path: {
    type: String
  },
  view: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Movies', MovieSchema)