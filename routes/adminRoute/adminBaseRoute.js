/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var adminLogin = {
  method: "POST",
  path: "/api/admin/login",
  config: {
    description: "Admin Login",
    tags: ["api", "admin"],
    handler: function(request, h) {
      return new Promise((resolve, reject) => {
        Controller.AdminBaseController.adminLogin(request.payload, function(
          error,
          data
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(UniversalFunctions.sendSuccess(null, data));
          }
        });
      });
    },
    validate: {
      payload: {
        emailId: Joi.string().required(),
        password: Joi.string()
          .required()
          .min(5)
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

var accessTokenLogin = {
  /* *****************access token login****************** */
  method: "POST",
  path: "/api/admin/accessTokenLogin",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.accessTokenLogin(userData, function(
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
    tags: ["api", "admin"],
    auth: "UserAuth",
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

var createAdmin = {
  method: "POST",
  path: "/api/admin/createAdmin",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.createAdmin(
        userData,
        payloadData,
        function(err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  config: {
    description: "create sub admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        emailId: Joi.string().required(),
        fullName: Joi.string()
          .optional()
          .allow("")
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

var getAdmin = {
  method: "GET",
  path: "/api/admin/getAdmin",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.getAdmin(userData, function(err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "get all sub admin list",
    tags: ["api", "admin"],
    auth: "UserAuth",
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

var blockUnblockAdmin = {
  method: "PUT",
  path: "/api/admin/blockUnblockAdmin",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.blockUnblockAdmin(
        userData,
        payloadData,
        function(err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  config: {
    description: "block/unblock a sub admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        adminId: Joi.string().required(),
        block: Joi.boolean().required()
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

var createUser = {
  method: "POST",
  path: "/api/admin/createUser",
  handler: function(request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.createUser(
        userData,
        payloadData,
        function(err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  config: {
    description: "create new user from admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        firstName: Joi.string()
          .regex(/^[a-zA-Z ]+$/)
          .trim()
          .min(2)
          .required(),
        lastName: Joi.string()
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

var getUser = {
    method: "GET",
    path: "/api/admin/getUser",
    handler: function(request, h) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.AdminBaseController.getUser(userData, function(err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        });
      });
    },
    config: {
      description: "get all user list",
      tags: ["api", "admin"],
      auth: "UserAuth",
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

  var blockUnblockUser = {
    method: "PUT",
    path: "/api/admin/blockUnblockUser",
    handler: function(request, h) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.AdminBaseController.blockUnblockUser(
          userData,
          payloadData,
          function(err, data) {
            if (!err) {
              resolve(UniversalFunctions.sendSuccess(null, data));
            } else {
              reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    config: {
      description: "block/unblock a user",
      tags: ["api", "admin"],
      auth: "UserAuth",
      validate: {
        headers: UniversalFunctions.authorizationHeaderObj,
        payload: {
          userId: Joi.string().required(),
          block: Joi.boolean().required()
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

  var changePassword = {
    method: "PUT",
    path: "/api/admin/changePassword",
    handler: function(request, h) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.AdminBaseController.changePassword(
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
          skip: Joi.boolean().required(),
          oldPassword: Joi.string().when('skip',{is:false,then: Joi.string().required().min(5),otherwise: Joi.string().optional().allow("")}),
          newPassword: Joi.string().when('skip',{is:false,then: Joi.string().required().min(5),otherwise: Joi.string().optional().allow("")})
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

  var logoutAdmin = {
    method: "PUT",
    path: "/api/admin/logout",
    config: {
      description: "Logout admin",
      auth: "UserAuth",
      tags: ["api", "admin"],
      handler: function(request, h) {
        var userData =
          (request.auth &&
            request.auth.credentials &&
            request.auth.credentials.userData) ||
          null;
        return new Promise((resolve, reject) => {
          Controller.AdminBaseController.logoutAdmin(userData, function(
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

var AdminBaseRoute = [
  adminLogin,
  accessTokenLogin,
  createAdmin,
  getAdmin,
  blockUnblockAdmin,
  createUser,
  getUser,
  blockUnblockUser,
  changePassword,
  logoutAdmin
];
module.exports = AdminBaseRoute;
