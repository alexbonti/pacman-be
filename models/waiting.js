var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var waiting = new Schema({
     uid1: {type:mongoose.Types.ObjectId , required: true, ref:'usersinfo'},
     fileUrl : {type:String},
     matched: {type: Boolean}
});

module.exports = mongoose.model('waiting',waiting);