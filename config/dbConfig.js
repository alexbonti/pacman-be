 'use strict';

var mongo = {
    // URI: process.env.MONGO_URI || 'mongodb://localhost/User_Onboarding_Deakin',
    URI: process.env.MONGO_URI || "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@pacman-bbbkw.mongodb.net/"+process.env.MONGO_DBNAME_DEV,
    port: 27017
};

module.exports = {
    mongo: mongo
};



