const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const LeaderBoardSchema= new Schema({
    player1:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    player2:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    winner:{
        type:mongoose.Types.ObjectId,
        required:true
    }
})

module.exports= Result = mongoose.model('leaderboard',LeaderBoardSchema);