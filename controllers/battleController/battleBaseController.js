var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
// var UploadManager = require('../../lib/uploadManager');
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");


//start Game
var startGame = function (userData, callback) {
    let userAdditionalInfo = '';
    let fIndex = '';
    async.series(
      [
        function (cb) {
          fIndex = parseInt(userData.fileUrlIndex);

          var query = {
            playerId: userData._id
          };
          var projection = {
            __v: 0
          };
          var options = { lean: true };
          
          Service.UserService.getUserInfo(query, projection, options, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
                userAdditionalInfo = (data && data[0]) || null;
                console.log("Additional Information fetched complete and correctly for the user");
                cb();
              
            }
          });
        },
        function (cb) {
          fUrl = userAdditionalInfo.models[fIndex];
         
          dataToSave = {uid: userData._id, fileUrl : fUrl, matched: false, username: userData.firstName };
          
          Service.BattleService.createBattle(dataToSave, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
                console.log("Data Stored Perfectly");
                cb();
              
            }
          });
        }
      ],
      function (err, result) {
        if (err) {
          callback(err);
          console.log(err+"in the backend for the required model selection");
        }
        else callback(null, { "msg": 1 });
      }
    );


  };



  //Get leaderboard
  var getLeaderBoard = function (callback) {
    var battleResults;
    async.series(
      [
        function (cb) {
          var query = {};
          var projection = {  __v: 0, _id: 0};
          var options = { lean: true };
          Service.LeaderBoardService.fetchBattleResults(query, projection, options, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } 
              else {
                battleResults = (data ) || null;
                cb();
              }
            
          });
        }
      ],
      function (err, result) {
        if (err) callback(err);
        else callback(null, { battleResults : battleResults });
      }
    );
  };

  //Begin Battle
  var beginBattle = function (u1id, u1file, u2id, u2file)  {


  
     /* Using Child Spawn function */
     var spawn = require("child_process").spawn; 
     // var process = await spawn('python',["-u","./capture.py","--red","baselineTeam","--blue","myTeam"]); 
   
     var process =  spawn('python',["-u",'./capture.py']); 
   
     let res1;
   
     process.stdout.on('data', async(data) =>{ 
    // res.send(data.toString());
    let result = data.toString();
    res1 = result.split(" ");
    console.log(res1);
   
   //  let point = res1[23];
   
   //  var resultOverview = new Result({
   //    opponent: res1[7],
   //    winner : res1[19],
   //    points: res1[23]
   //  });
   
   //  try{
   //    await resultOverview.save();
   //  }
   //  catch(err){
   //    console.log("Error in saving the results onto the Database")
   //  }
   
   //  battleResult={
      
   //  }
    if(res1[19] == "Red"){
      return res.status(200).json({msg:"You won by "+point+" points"});     
    }
    if(res1[19] == "Blue"){
      return res.status(200).json({msg:"You lost by "+point+" points"});
    }
    });
     
  }

  module.exports = {
      startGame : startGame,
      beginBattle: beginBattle,
      getLeaderBoard: getLeaderBoard
  }