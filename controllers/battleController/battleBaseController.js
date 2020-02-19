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

  beginBattle = (user1, user2) => {
     let result = Math.round(Math.random() * 10);
     if(result % 2 == 0) {
       console.log("User 1 is the Winner");
     }else{
       console.log("User 2 is the Winner");
     }
  }

  module.exports = {
      startGame : startGame
  }