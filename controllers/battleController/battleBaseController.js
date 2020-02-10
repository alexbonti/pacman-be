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
          Service.battleService.createBattle(userData, function (
            err,
            userDataFromDB
          ) {
            if (err) {
                cb(err);
            } else {
              returnedUserData = userDataFromDB;
              cb();
            }
          });
        }
      ],
      function (err, result) {
        if (err) callback(err);
        else callback(null, { userId: userId });
      }
    );
  };

  module.exports = {
      startGame : startGame
  }