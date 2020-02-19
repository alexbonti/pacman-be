/**
 * Created by Navit
 */

"use strict";
//External Dependencies
var Hapi = require("hapi");

//Internal Dependencies
var Config = require("./config");
var Plugins = require("./plugins");
var SocketManager = require("./lib/socketManager");
var Routes = require("./routes");
var MongoConnect = require('./mongoConnect')
var BootStrap = require('./utils/bootStrap')
var cron = require('node-cron');
var async = require("async");
var Service = require("./services");
var mongoose = require('mongoose');

const init = async () => {
  //Create Server
  var server = new Hapi.Server({
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.HAPI_PORT,
    routes: { cors: true }
  });

  //Register All Plugins
  await server.register(Plugins, {}, err => {
    if (err) {
      server.log(["error"], "Error while loading plugins : " + err);
    } else {
      server.log(["info"], "Plugins Loaded");
    }
  });

  //add views
  await server.views({
    engines: {
      html: require("handlebars")
    },
    relativeTo: __dirname,
    path: "./views"
  });

  //Default Routes
  server.route({
    method: "GET",
    path: "/",
    handler: function (req, res) {
      return res.view("welcome");
    }
  });

  server.route(Routes);

  SocketManager.connectSocket(server);

  BootStrap.bootstrapAdmin(function (err) {
    if (err) console.log(err)
  });

  server.events.on("response", function (request) {
    console.log(
      request.info.remoteAddress +
      ": " +
      request.method.toUpperCase() +
      " " +
      request.url.pathname +
      " --> " +
      request.response.statusCode
    );
    console.log("Request payload:", request.payload);
  });

  /*const callback = (data) => {
    console.log("The Data Received is "+data);
  }*/

  //CRON 
  cron.schedule("* * * * *", (callback) => {
    let player;
    let opponent;
    let result;
    let winner, winnerDetails;
    let loser, loserDetails;
    console.log("Cron started Mate!!");
    async.series(
      [
        function (cb) {

          Service.BattleService.findPlayer({}, {}, { limit: 1 }, function (
            err,
            data
          ) {
            if (err) {
              //cb(err);
              console.log(err);
            } else {
              player = data && data[0] || null;
              if (player) {
                console.log(player);
                cb();
              } else {
                player = null;
                console.log("No More Players Found Waiting");
                cb();
              }


              //cb();
              console.log("Operation 1 Done");
            
            }

          })
        },


        function (cb) {

          Service.BattleService.findPlayer({ _id: { $ne: player._id } }, {}, { limit: 1 }, function (
            err,
            data
          ) {
            if (err) {
              //cb(err);
              console.log(err);
            } else {
              opponent = data && data[0] || null;
              if (opponent) {
                console.log(opponent);
                console.log("Opponent Section Here");
                cb();
              } else {
                opponent = null;
                console.log("No Opponent Found!!!!!!");
                cb();
              }


              //cb();
              console.log("Operation 2 Done");
              

            }

          })
        },

        function (cb) {
          result = beginBattle();
          console.log(result);

          if(player === null || opponent === null)
          {
            cb();
          }

          else{

          if (result == 1) {
            winner = player;
            loser = opponent;
            cb();
          } else {
            winner = opponent;
            loser = player;
            cb();
          }
          }
          
        },

        function (cb) {

          if(player == null || opponent == null)
          {
            cb();
          }
          else{

          Service.UserService.getUserInfo({ playerId: winner.uid }, {}, {}, function (err, data) {
            if (err) {
              console.log("Error in fetching the Details of the WIinner");
            }
            else {
              winnerDetails = data && data[0] || null;
              console.log("Winner Details" + winnerDetails);
              cb();
            }
          })
        }
        },

        //Update Details Accordingly for the WInner
        function (cb) {

          if(player == null || opponent == null)
          {
            cb();
          }
          else{

          let matchesPlayed = winnerDetails.matchesPlayed;
          matchesPlayed++;
          let matchesWon = winnerDetails.matchesWon;
          matchesWon++;
          let dataToSetForWinner = {
            matchesPlayed,
            matchesWon
          }

          var query = {
            playerId: winner.uid
          };
          var options = { lean: true };
          Service.UserService.updateUserAdditionalInfo(query, dataToSetForWinner, { useFindAndModify: false }, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
              console.log("Data Modified for the WInner Succesfully");
              cb();
            }
          });
        }

        },

        //Fetch the Loser Details
        function (cb) {

          if(player == null || opponent == null)
          {
            cb();
          }
          else{

          Service.UserService.getUserInfo({ playerId: loser.uid }, {}, {}, function (err, data) {
            if (err) {
              console.log("Error in fetching the Details of the Loser");
            }
            else {
              loserDetails = data && data[0] || null;
              cb();
            }
          })
        }
        },

        //Update Details Accordingly for the Loser Accordingly
        function (cb) {


          if(player == null || opponent == null)
          {
            cb();
          }
          else{

          let matchesPlayed = loserDetails.matchesPlayed;
          matchesPlayed++;
          let dataToSetForLoser = {
            matchesPlayed,
          }

          var query = {
            playerId: loser.uid
          };
          var options = { lean: true };
          Service.UserService.updateUserAdditionalInfo(query, dataToSetForLoser, { useFindAndModify: false }, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
              console.log("Data Modified for the Loser Succesfully");
              cb();
            }
          });

        }
        },

        //Now Delete the WInner Record from Battle Collection
        function (cb) {

          if(player == null || opponent == null)
          {
            cb();
          }
          else{

          Service.BattleService.deleteBattle({ _id : winner._id }, function (err, data) {
            if (err) {
              console.log("Error in fexecuting the Delete Operation");
            }
            else {
              console.log("Winner Record Deleted Successfully");
              winner = null;
              winnerDetails = null;
              player = null;
              opponent = null;
              cb();
            }
          })
        }
        },

        //Delete the record for the Loser from the Battle Collection
        function (cb) {

          if(player == null || opponent == null)
          {
            cb();
          }
           else{
          Service.BattleService.deleteBattle({ _id : loser._id }, function (err, data) {
            if (err) {
              console.log("Error in Deleting the Loser Details");
            }
            else {
              console.log("Loser Record Deleted Succesfully");
              loser = null;
              loserDetails = null;
              cb();
            }
          })
        }
        }
      ],

      function (err, result) {
        if (err) {
          //  callback(err);
          console.log(err);
        } else {
          //  callback();
          console.log("Operation Completed Successfully!!!!!!");
        }
      }
    );


  });

  const beginBattle = () => {
    let result = Math.round(Math.random() * 10);

    if (result % 2 == 0) {
      return 1;
    }

    else {
      return 2;
    }

    return 1;
  }

  // Start Server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};




process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
