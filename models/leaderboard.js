const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const LeaderBoardSchema= new Schema([{
    player1:{
        type:mongoose.Types.ObjectId
    },
    player2:{
        type:mongoose.Types.ObjectId
    },
    winner:{
        type:mongoose.Types.ObjectId
    }
}])

module.exports= Result = mongoose.model('leaderboard',LeaderBoardSchema);