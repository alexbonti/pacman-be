'use strict';
/**
 * Created by Navit.
 */

var SocketIO = require('socket.io');

exports.connectSocket = function (server) {
    var io = SocketIO.listen(server.listener);

    console.log("socket server started");

    io.on('connection', function (socket) {
        console.log("connection established: ",socket.id);
        socket.emit('message', {message: {type:'connection',statusCode:200,statusMessage:'WELCOME TO USER ONBOARDING MODULE',data:""}});
    })
}