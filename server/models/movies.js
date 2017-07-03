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
  track: {
    type: Boolean
  }
})

module.exports = mongoose.model('Movies', MovieSchema)