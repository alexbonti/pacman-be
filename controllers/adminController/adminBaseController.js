/**
 * Created by Navit on 15/11/16.
 */
var Service = require('../../services');
var UniversalFunctions = require('../../utils/universalFunctions');
var async = require('async');
// var UploadManager = require('../../lib/uploadManager');
var TokenManager = require('../../lib/tokenManager');
var CodeGenerator = require('../../lib/codeGenerator');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require('underscore');

var adminLogin = function(payloadData,callback){
    payloadData.emailId = payloadData.emailId.toLowerCase();
    var userFound = false;
    var accessToken = null;
    var successLogin = false;
    async.series([
        function (cb) {
            //verify email address
            if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
                cb(ERROR.INVALID_EMAIL_FORMAT);
            } else {
                cb();
            }
        },
        function (cb) {
            var criteria = {
                emailId: payloadData.emailId
            };

            var option = {
                lean: true
            };
            Service.AdminService.getAdmin(criteria, {}, option, function (err, result) {
                if (err) {
                    cb(err)
                } else {
                    userFound = result && result[0] || null;
                    cb();
                }
            });

        },
        function (cb) {
            //validations
            if (!userFound) {
                cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_NOT_FOUND);
            } else {
                if (userFound && (userFound.password != UniversalFunctions.CryptData(payloadData.password))) {
                    cb(ERROR.INCORRECT_PASSWORD);
                }
                else if(userFound.isBlocked == true){
                    cb(ERROR.ADMIN_BLOCKED)
                }
                else {
                    successLogin = true;
                    cb();
                }
            }
        },
        function(cb){
            var criteria = {
                email: payloadData.Email,

            };
            var projection = {
                password:0,
            };
            var option = {
                lean: true
            };
            Service.AdminService.getAdmin(criteria,  projection , option, function (err, result) {
                if (err) {
                    cb(err)
                } else {
                    userFound = result && result[0] || null;
                    cb();
                }
            });
        },
        function (cb) {
            if (successLogin) {
                var tokenData = {
                    id: userFound._id,
                    type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
                };
                TokenManager.setToken(tokenData, function (err, output) {
                    if (err) {
                        cb(err);
                    } else {
                        if (output && output.accessToken) {
                            accessToken = output && output.accessToken;
                            cb();
                        } else {
                            cb(error.IMP_ERROR)
                        }
                    }
                })
            } else {
                cb(error.IMP_ERROR)
            }

        },
    ], function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                accessToken: accessToken,
                adminDetails: userFound
            });
        }
    });
}

module.exports = {
    adminLogin:adminLogin
};