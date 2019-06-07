/**
 * Created by Navit
 */
var Joi = require('joi');
var async = require('async');
var MD5 = require('md5');
var Boom = require('boom');
var CONFIG = require('../config');
var randomstring = require("randomstring");
var validator = require('validator');
var Moment = require('moment');
var MomentRange = require('moment-range');
var moment = MomentRange.extendMoment(Moment);

var sendError = function (data) {
    console.trace('ERROR OCCURED ', data)
    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        console.log('attaching resposnetype',data.type)
        var errorToSend = new Boom( data.customMessage,{statusCode:data.statusCode});
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else {
        var errorToSend = '';
        if (typeof data == 'object') {
            if (data.name == 'MongoError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if (data.code = 11000) {
                    var duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}','');
                    errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1')>-1){
                        errorToSend = CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            } else if (data.name == 'ApplicationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name == 'ValidationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name == 'CastError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        } else {
            errorToSend = data
        }
        var customErrorMessage = errorToSend;
        if (typeof customErrorMessage == 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        return new Boom(customErrorMessage,{statusCode:400})
    }
};

var sendSuccess = function (successMsg, data) {
    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, message: successMsg.customMessage, data: data || {}};

    }else {
        return {statusCode:200, message: successMsg, data: data || {}};

    }
};
var failActionFunction = function (request, reply, error) {
    var customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation
    return error;
};

var authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required()
}).unknown();

var generateRandomString = function () {
    return randomstring.generate(12);
};

var generateRandomNumber = function () {
    var num = Math.floor(Math.random() * 90000) + 10000;
    return num;
};

var generateRandomAlphabet = function (len) {
   var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
        randomString=randomString.toUpperCase();
    }
    return randomString;
}

var CryptData = function (stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};

var validateLatLongValues = function (lat, long) {
    var valid = true;
    if (lat < -90 || lat>90){
        valid = false;
    }
    if (long <-180 || long > 180){
        valid = false;
    }
    return valid;
};

var validateString = function(str, pattern) {
    console.log(str, pattern,str.match(pattern));

    return str.match(pattern) ;
};
var verifyEmailFormat = function (string) {
    return validator.isEmail(string)
};
var deleteUnnecessaryUserData = function (userObj) {
    console.log('deleting>>',userObj)
    delete userObj.__v;
    delete userObj.password;
    delete userObj.registrationDate;
    delete userObj.OTPCode;
    console.log('deleted',userObj)
    return userObj;
};
var generateFilenameWithExtension= function generateFilenameWithExtension(oldFilename, newFilename) {
    var ext = oldFilename.substr((~-oldFilename.lastIndexOf(".") >>> 0) + 2);
    return newFilename + '.' + ext;
}


function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

var getTimestamp = function (inDate) {
    if (inDate)
        return new Date();

    return new Date().toISOString();
};

var createArray = function(List, keyName) {
    console.log("create array------>>>>>>>")
    var IdArray = [];
    var keyName = keyName;
    for (var key in List) {
        if (List.hasOwnProperty(key)) {
            //logger.debug(data[key][keyName]);
            IdArray.push((List[key][keyName]).toString());
        }
    }
    return IdArray;

};
function getRange(startDate, endDate, diffIn) {

    var dr = moment.range(startDate, endDate);

    if (!diffIn)
        diffIn = CONFIG.APP_CONSTANTS.TIME_UNITS.HOURS;
    if (diffIn == "milli")
        return dr.diff();

    return dr.diff(diffIn);

}

module.exports = {
	generateRandomString: generateRandomString,
    CryptData: CryptData,
    CONFIG: CONFIG,
    sendError: sendError,
    sendSuccess: sendSuccess,
    failActionFunction: failActionFunction,
    authorizationHeaderObj: authorizationHeaderObj,
    //forgetPasswordEmail: forgetPasswordEmail,
    validateLatLongValues:validateLatLongValues,
    validateString:validateString,
    verifyEmailFormat:verifyEmailFormat,
    deleteUnnecessaryUserData:deleteUnnecessaryUserData,
    generateFilenameWithExtension:generateFilenameWithExtension,
    isEmpty:isEmpty,
    getTimestamp:getTimestamp,
    generateRandomNumber:generateRandomNumber,
    createArray:createArray,
    generateRandomAlphabet:generateRandomAlphabet,
    getRange:getRange
};
