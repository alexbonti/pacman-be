var Models = require("../models");

var addIntoLeaderBoard = function(objToSave, callback) {
  new Models.LeaderBoard(objToSave).save(callback);
};


module.exports = {
  addIntoLeaderBoard: addIntoLeaderBoard
};