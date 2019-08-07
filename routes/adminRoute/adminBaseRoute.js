/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var adminLogin = {
    method: 'POST',
    path: '/api/admin/login',
    config: {
        description: "Admin Login",
        tags: ['api', 'admin'],
        handler: function (request, h) {
            return new Promise((resolve,reject)=>{
                Controller.AdminBaseController.adminLogin(request.payload, function (error, data) {
                    if (error) {
                        reject(UniversalFunctions.sendError(error));
                    } else {
                        resolve(UniversalFunctions.sendSuccess(null, data))
                    }
                });
            })
            
        },
        validate: {
            payload: {
                emailId: Joi.string().required(),
                password: Joi.string().required().min(5).trim()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var AdminBaseRoute = [
    adminLogin
  ];
  module.exports = AdminBaseRoute;