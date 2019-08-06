/**
 * Created by Navit on 23/01/2016 AD.
 */
var Models = require('../models');

var getForgetPasswordRequest = function (conditions, projection, options, callback ) {
    Models.ForgetPassword.find(conditions, projection, options, callback );
};
var updateForgetPasswordRequest = function(criteria, dataToSet, options, callback) {
    Models.ForgetPassword.findOneAndUpdate(criteria, dataToSet, options, callback);

};

var createForgetPasswordRequest = function (data, callback) {
    var forgotPasswordEntry = new Models.ForgetPassword(data);
    forgotPasswordEntry.save( function (err, result) {
        callback(err, result);
    })
}
module.exports = {
    getForgetPasswordRequest : getForgetPasswordRequest,
    updateForgetPasswordRequest : updateForgetPasswordRequest,
    createForgetPasswordRequest : createForgetPasswordRequest
}