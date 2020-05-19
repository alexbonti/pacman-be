const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const LeaderBoardSchema= new Schema({
    winner:{ type:String},
    loser:{type:String},
    margin:{type:Number}
})

module.exports= Result = mongoose.model('leaderboard',LeaderBoardSchema);