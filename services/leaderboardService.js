var Models = require("../models");

var addIntoLeaderBoard = function(objToSave, callback) {
  new Models.LeaderBoard(objToSave).save(callback);
};

var fetchBattleResults = function(criteria, projection, options, callback) {
  Models.LeaderBoard.find(criteria, projection, options, callback);
};


module.exports = {
  addIntoLeaderBoard: addIntoLeaderBoard,
  fetchBattleResults : fetchBattleResults
};