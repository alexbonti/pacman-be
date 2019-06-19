/**
 * Created by Navit
 */

'use strict';
var Mongoose = require('mongoose');
var CONFIG = require('./config');



//Connect to MongoDB
Mongoose.connect(CONFIG.DB_CONFIG.mongo.URI,{useNewUrlParser:true}, function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});

exports.Mongoose = Mongoose;


