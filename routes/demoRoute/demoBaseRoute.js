/**
 * Created by Navit
 */
var UniversalFunctions = require("../../utils/universalFunctions");
var Joi = require("joi");
var Config = require("../../config");
var Controller = require("../../controllers");

var demoApiAuth = {
  method: "POST",
  path: "/api/demo/demoApiAuth",
  config: {
    description: "demo api with auth",
    tags: ["api", "demo"],
    auth: 'UserAuth',
    handler: function(request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData|| null;
      return new Promise((resolve, reject) => {
        Controller.DemoBaseController.demoFunctionAuth(userData,payloadData, function(
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        message: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var demoApi = {
  method: "POST",
  path: "/api/demo/demoApi",
  config: {
    description: "demo api",
    tags: ["api", "demo"],
    handler: function(request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.DemoBaseController.demoFunction(payloadData, function(
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      payload: {
        message: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var DemoBaseRoute = [demoApi];
module.exports = DemoBaseRoute;
