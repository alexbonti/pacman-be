const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const LeaderBoardSchema= new Schema({
    player1:{
        type:String,
        required:true
    },
    player2:{
        type:String,
        required:true
    },
    winner:{
        type:String,
        required:true
    }
})

module.exports= Result = mongoose.model('leaderboard',LeaderBoardSchema);