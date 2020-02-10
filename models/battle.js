var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var battle = new Schema({
   waiting:[{uid: {type:mongoose.Types.ObjectId , required: true, ref:'user'} , fileUrl : String}],
   playing: [{uone: {type:mongoose.Types.ObjectId , required: true, ref:'user'} , utwo: {type:mongoose.Types.ObjectId , required: true, ref:'user'}}],
});

module.exports = mongoose.model('battle',battle);