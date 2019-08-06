var async = require('async');
var Config = require('../config');
var UniversalFunctions = require('./universalFunctions');
var Service = require('../services');

exports.bootstrapAdmin = function (callbackParent) {
    var taskToRunInParallel = [];

    var adminData = [
        {
            email: 'launchpad@admin.com',
            password: UniversalFunctions.CryptData("123456"),
            fullName: 'Launchpad Admin',
            userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN,
            createdAt: UniversalFunctions.getTimestamp()
        }
    ];

    adminData.forEach(function (dataObj) {
        taskToRunInParallel.push((function (dataObj) {
            return function (embeddedCB) {
                insertData(dataObj, embeddedCB);
            }
        })(dataObj));
    });
    async.parallel(taskToRunInParallel, function (error) {
        if (error)
            return callbackParent(error);
        return callbackParent(null);
    });
};

function insertData(adminData, callbackParent) {
    Service.AdminService.createAdmin(adminData, function (err, response) {
        if(err){
            console.log("Implementation err",err);
            return callbackParent(err);
        }
        else{
            console.log("Admins Added Succesfully");
            return callbackParent(null);
        }
    });
}