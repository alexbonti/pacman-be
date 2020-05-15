var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var battle = new Schema({
     uid: {type:mongoose.Types.ObjectId , required: true, ref:'usersinfo'},
     fileUrl : {type:String},
     matched: {type: Boolean}
});



module.exports = mongoose.model('battle',battle);