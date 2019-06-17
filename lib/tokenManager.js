"use strict";
/**
 * Created by shahab on 11/7/15.
 */
var Config = require("../config");
var Jwt = require("jsonwebtoken");
var async = require("async");


var decodeToken = async function(token) {
  //var token = Jwt.sign(token, process.env.JWT_SECRET_KEY);
  try{
    const decodedData = await Jwt.verify(token, process.env.JWT_SECRET_KEY);
    return {userData:decodedData,token:token}
  } catch(err){
      return err
  }
};

module.exports = {
  decodeToken: decodeToken
};
