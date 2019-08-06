/**
 * Created by Navit on 23/01/2016 AD.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONFIG = require('../config');

var forgetPasswordRequests = new Schema({
    customerID: {type: Schema.ObjectId, ref: 'users'},
    userType: {
        type: String,
        enum: [
            CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER
        ],
        required: true
    },
    isChanged: {type: Boolean, default: false},
    requestedAt: {type: Date},
    changedAt: {type: Date}
});

module.exports = mongoose.model('forgetPasswordRequests', forgetPasswordRequests);