/**
 * Created by Navit
 */

"use strict";

var Models = require("../models");

var updateAdmin = function(criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Admin.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
var createAdmin = function(objToSave, callback) {
  new Models.Admin(objToSave).save(callback);
};
//Delete User in DB
var deleteAdmin = function(criteria, callback) {
  Models.Admin.findOneAndRemove(criteria, callback);
};

//Get Users from DB
var getAdmin = function(criteria, projection, options, callback) {
  options.lean = true;
  Models.Admin.find(criteria, projection, options, callback);
};

var getAdminPromise = function(criteria, projection, options) {
  options.lean = true;
  return new Promise((resolve, reject) => {
    Models.Admin.find(criteria, projection, options, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
module.exports = {
  updateAdmin: updateAdmin,
  createAdmin: createAdmin,
  deleteAdmin: deleteAdmin,
  getAdmin: getAdmin,
  getAdminPromise: getAdminPromise
};
