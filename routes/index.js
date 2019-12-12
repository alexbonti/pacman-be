/**
 * Created by Navit
 */
"use strict";

var DemoBaseRoute = require("./demoRoute/demoBaseRoute");
var UserBaseRoute = require("./userRoute/userBaseRoute");
var AdminBaseRoute = require("./adminRoute/adminBaseRoute");
var UploadBaseRoute = require("./uploadRoute/uploadBaseRoute");

var APIs = [].concat(DemoBaseRoute, UserBaseRoute, AdminBaseRoute, UploadBaseRoute);
module.exports = APIs;
