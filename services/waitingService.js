var Models = require("../models");

var updateWaitingList = function(criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Waiting.findOneAndUpdate(criteria, dataToSet, options, callback);
};



//Insert players onto the waiting list
var addPlayerToWaitingList = function(objToSave, callback) {
  new Models.Waiting(objToSave).save(callback);
};

//Delete Details in DB
var deletePlayerToWaitingList = function(criteria, callback) {
  Models.Waiting.findOneAndRemove(criteria, callback);
};

//Get DEtails  from DB
var findPlayerFromWaitingList = function(criteria, projection, options, callback) {
  Models.Waiting.find(criteria, projection, options, callback);
};

module.exports = {
  
    updateWaitingList : updateWaitingList,
    addPlayerToWaitingList: addPlayerToWaitingList,
    deletePlayerToWaitingList : deletePlayerToWaitingList,
    findPlayerFromWaitingList : findPlayerFromWaitingList
};
