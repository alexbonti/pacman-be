var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var battle = new Schema({
   user:{},
   opponent: {},
   winner: {}
});

module.exports = mongoose.model('battle',battle);