const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const LeaderBoardSchema= new Schema({
    Player1:{ type:String},
    Player2:{type:String},
    Winner:{type:String},
    Margin:{type:Number}
})

module.exports= Result = mongoose.model('leaderboard',LeaderBoardSchema);