var async = require('async');
var Config = require('../config');
var UniversalFunctions = require('./universalFunctions');
var Service = require('../services');

exports.bootstrapAdmin = function (callbackParent) {
    var taskToRunInParallel = [];

    var adminData = [
        {
            emailId: 'launchpad@admin.com',
            password: UniversalFunctions.CryptData("123456"),
            fullName: 'Launchpad Admin',
            userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN,
            createdAt: UniversalFunctions.getTimestamp(),
            firstLogin: true
        },
        {
            emailId: 'launchpad2@admin.com',
            password: UniversalFunctions.CryptData("123456"),
            fullName: 'Launchpad Admin 2',
            userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN,
            createdAt: UniversalFunctions.getTimestamp(),
            firstLogin: true
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
    var _skip = false
    async.series([
        function(cb){
            Service.AdminService.getAdmin({emailId:adminData.emailId},{},{},function(err,data){
                if(err) cb(err)
                else {
                    if(data.length != 0) {
                        _skip = true;
                        cb()
                    }
                    else cb()
                }
            })
        },
        function(cb){
            if(!_skip){
                Service.AdminService.createAdmin(adminData, function (err, response) {
                    if(err){
                        console.log("Implementation err",err);
                        cb(err)
                    }
                    else{
                        console.log("Admin Added Succesfully");
                        cb()
                    }
                });
            }
            else cb()
        }
    ],function(err,result){
        if(err) return callbackParent(err)
        else {
            return callbackParent(null);
        }
    })
    
}