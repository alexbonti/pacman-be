var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');


//The Schema Definition for the User Extended to facilitate the additional values
var userExtended = new Schema({
    playerId : {type:mongoose.Types.ObjectId , required: true, ref:'user'},
    matchesPlayed : {type: Number, default: 0, trim: true},
    matchesWon : {type: Number, default: 0, trim: true},
    highestScore : {type: Number, default: 0, trim: true },
    waiting : {type: Boolean, default: false, trim: true},
    lastLogin : {type: Date, default: Date.now},
    models : [{}],
    currentLevelScore : {type: Number, default: 0, trim: true}
});

module.exports = mongoose.model('usersinfo',userExtended)
