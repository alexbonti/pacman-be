'use strict';
/**
 * Created by Navit
 */
const Config = require('../config')
const swaggerOptions = {
    pathPrefixSize: 2,
    info: {
        'title': ` Pacman API Documentation`,
        'description': `Pacman API documentation.`,
        'version': '0.0.1'
    }
};

exports.register = function (server, options) {
    server.register({
        plugin: require('hapi-swagger'),
        options: swaggerOptions
    }, {}, function (err) {
        if (err) server.log(['error'], 'hapi-swagger load error: ' + err)
        else server.log(['info'], 'hapi-swagger interface loaded')
    });
};

exports.name = 'swagger-plugin';
