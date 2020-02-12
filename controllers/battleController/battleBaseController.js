var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
// var UploadManager = require('../../lib/uploadManager');
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var cron = require('node-cron');


//start Game
var startGame = function (userData, callback) {
    async.series(
      [
        function (cb) {
          fUrl = userData.fileUrl;
          dataToSave = {uid: userData._id, fileUrl : userData.fileUrl, waiting: true, playing: false };
          
          Service.BattleService.createBattle(dataToSave, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
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

    cron.schedule("* * * * *", () => {
      //Find Other User with status waiting except the user
      //Update the user status 
      //Then change status of both, then call the random game function
      //Call the game function logic

      var opponentData;

      async.series(
        [//userData.fileUrl
          function (cb) {
            var query = {
               $and: [ { waiting: true }, {fileUrl: "http" } ] 
              }; 
          
            var options = { lean: true };
            Service.BattleService.findOpponent(query, {}, options, function (err, data) {
              if (err) {
                cb(err);
              }
                  opponentData = (data && data[0]) || null;
                  console.log(opponentData);
                  cb();
               
            });
          },
          //Update the status and pit against each other
          function (cb) {
            //trying to update customer
            var criteria = {
              uid: userData._id
            };
            var setQuery = {
              $set: { waiting: false, playing : true },
            };
            var options = { new: true };
            Service.BattleService.updateBattle(criteria, setQuery, options, function (
              err,
              updatedData
            ) {
              if (err) {
                cb(err);
              } else {
                  cb();
                }
              
            });
          },

          //Update Opponent Data
          function (cb) {
            //trying to update customer
            var criteria = {
              uid: opponentData.uid
            };
            var setQuery = {
              $set: { waiting: false, playing : true },
            };
            var options = { new: true };
            Service.BattleService.updateBattle(criteria, setQuery, options, function (
              err,
              updatedData
            ) {
              if (err) {
                cb(err);
              }  else {
                  console.log("Data Updated");
                  cb();
                }
              
            });
          }
        ],
        function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback();
          }
        }
      );
      
       beginBattle(1,2);
     });


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