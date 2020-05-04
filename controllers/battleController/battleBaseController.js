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
    async.series(
      [
        function (cb) {
          fUrl = userData.fileUrl;
          dataToSave = {uid: userData._id, fileUrl : userData.fileUrl, matched: false };
          
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
        if (err) callback(err);
        else callback(null, { "msg": 1 });
      }
    );


  };

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
      beginBattle: beginBattle
  }