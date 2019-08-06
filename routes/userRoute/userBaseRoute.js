/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var userRegister = {
  method: "POST",
  path: "/api/user/register",
  handler: function(request, h) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        Controller.UserBaseController.createUser(payloadData, function(
          err,
          data
        ) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .CREATED,
                data
              )
            );
          }
        });
      }
    });
  },
  config: {
    description: "Register a new user",
    tags: ["api", "user"],
    validate: {
      payload: {
        first_name: Joi.string()
          .regex(/^[a-zA-Z ]+$/)
          .trim()
          .min(2)
          .required(),
        last_name: Joi.string()
          .regex(/^[a-zA-Z ]+$/)
          .trim()
          .min(2)
          .required(),
        emailId: Joi.string().required(),
        phoneNumber: Joi.string()
          .regex(/^[0-9]+$/)
          .min(5)
          .required(),
        countryCode: Joi.string()
          .max(4)
          .required()
          .trim(),
        password: Joi.string()
          .optional()
          .min(5)
          .allow(""),
        facebookId: Joi.string()
          .optional()
          .trim()
          .allow(""),
        deviceType: Joi.string()
          .required()
          .valid([
            Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID
          ]),
        deviceToken: Joi.string()
          .required()
          .trim()
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

var verifyOTP = {
  method: "PUT",
  path: "/api/user/verifyOTP",
  handler: function(request, h) {
    var payloadData = request.payload;
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.UserBaseController.verifyOTP(userData, payloadData, function(
        err,
        data
      ) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(
            UniversalFunctions.sendSuccess(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                .VERIFY_COMPLETE,
              data
            )
          );
        }
      });
    });
  },
  config: {
    auth: "UserAuth",
    description: "Verify OTP for User",
    tags: ["api", "user"],
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        OTPCode: Joi.string()
          .length(6)
          .required()
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

var login = {
  method: "POST",
  path: "/api/user/login",
  handler: function(request, h) {
    var payloadData = request.payload;
    if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
      reject(
        UniversalFunctions.sendError(
          UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
            .INVALID_EMAIL_FORMAT
        )
      );
    } else {
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.loginUser(payloadData, function(
          err,
          data
        ) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(null, data));
          }
        });
      });
    }
  },
  config: {
    description: "Login Via Phone Number & Password For User",
    tags: ["api", "user"],
    validate: {
      payload: {
        emailId: Joi.string().required(),
        password: Joi.string()
          .required()
          .min(5)
          .trim(),
        deviceType: Joi.string()
          .required()
          .valid([
            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES
              .ANDROID
          ]),
        deviceToken: Joi.string()
          .required()
          .trim()
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

var facebookLogin = {
  method: "POST",
  path: "/api/user/loginViaFacebook",
  handler: function(request, h) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UserBaseController.loginViaFacebook(payloadData, function(
        err,
        data
      ) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(null, data));
        }
      });
    });
  },
  config: {
    description: "Login Via Facebook For Customer",
    tags: ["api", "customer"],
    validate: {
      payload: {
        facebookId: Joi.string().required(),
        deviceType: Joi.string()
          .required()
          .valid([
            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES
              .ANDROID
          ]),
        deviceToken: Joi.string()
          .required()
          .trim(),
        appVersion: Joi.string()
          .required()
          .trim()
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

var resendOTP = {
  method: "PUT",
  path: "/api/user/resendOTP",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.UserBaseController.resendOTP(userData, function(err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(
            UniversalFunctions.sendSuccess(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                .VERIFY_SENT,
              data
            )
          );
        }
      });
    });
  },
  config: {
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    description: "Resend OTP for Customer",
    tags: ["api", "customer"],
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getOTP = {
  method: "GET",
  path: "/api/getOTP",
  config: {
    description: "get OTP for Customer",
    tags: ["api", "user"],
    handler: function(request, h) {
      var userData = request.query;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.getOTP(userData, function(
          error,
          success
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .DEFAULT,
                success
              )
            );
          }
        });
      });
    },
    validate: {
      query: {
        emailId: Joi.string().required()
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

var accessTokenLogin = {
  /* *****************access token login****************** */
  method: "POST",
  path: "/api/user/accessTokenLogin",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    var data = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UserBaseController.accessTokenLogin(userData, data, function(
        err,
        data
      ) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "access token login",
    tags: ["api", "user"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        deviceToken: Joi.string()
          .trim()
          .required(),
        deviceType: Joi.string()
          .required()
          .valid([
            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.DEVICE_TYPES
              .ANDROID
          ])
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

var logoutCustomer = {
  method: "PUT",
  path: "/api/user/logout",
  config: {
    description: "Logout user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function(request, h) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.logoutCustomer(userData, function(
          err,
          data
        ) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .LOGOUT
              )
            );
          }
        });
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
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

var getProfile = {
  method: "GET",
  path: "/api/user/getProfile",
  config: {
    description: "get profile of user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function(request, h) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserBaseController.getProfile(userData, function(
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
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

var changePassword = {
  method: "PUT",
  path: "/api/user/changePassword",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.UserBaseController.changePassword(
        userData,
        request.payload,
        function(err, user) {
          if (!err) {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .PASSWORD_RESET,
                user
              )
            );
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  config: {
    description: "change Password",
    tags: ["api", "customer"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        oldPassword: Joi.string()
          .required()
          .min(4),
        newPassword: Joi.string()
          .required()
          .min(4)
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

var forgotPassword = {
  method: "POST",
  path: "/api/user/forgotPassword",
  config: {
    description: "forgot password",
    tags: ["api", "user"],
    handler: function(request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_EMAIL_FORMAT
            )
          );
        } else {
          Controller.UserBaseController.forgetPassword(
            request.payload,
            function(error, success) {
              if (error) {
                reject(UniversalFunctions.sendError(error));
              } else {
                resolve(
                  UniversalFunctions.sendSuccess(
                    UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                      .VERIFY_SENT,
                    success
                  )
                );
              }
            }
          );
        }
      });
    },
    validate: {
      payload: {
        emailId: Joi.string().required()
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

var resetPassword = {
  method: "POST",
  path: "/api/user/resetPassword",
  config: {
    description: "reset password",
    tags: ["api", "user"],
    handler: function(request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_EMAIL_FORMAT
            )
          );
        } else {
          Controller.UserBaseController.resetPassword(request.payload, function(
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .PASSWORD_RESET,
                  success
                )
              );
            }
          });
        }
      });
    },
    validate: {
      payload: {
        password: Joi.string()
          .min(6)
          .required()
          .trim(),
        emailId: Joi.string().required(),
        OTPCode: Joi.string().required()
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

var UserBaseRoute = [
  userRegister,
  verifyOTP,
  login,
  facebookLogin,
  resendOTP,
  getOTP,
  accessTokenLogin,
  logoutCustomer,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword
];
module.exports = UserBaseRoute;
