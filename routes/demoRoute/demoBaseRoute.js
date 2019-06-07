/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require("../../utils/universalFunctions");
var Joi = require("joi");
var Config = require("../../config");
var Controller = require("../../controllers");

var demoApi = {
  method: "POST",
  path: "/api/demo/demoApi/",
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
