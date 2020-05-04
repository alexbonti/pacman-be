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
var BootStrap = require('./utils/bootStrap');

//CRON Implementation related Dependencies
var cron = require('node-cron');
var async = require("async");
var Service = require("./services");
var mongoose = require('mongoose');
var Controller = require("./controllers");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
// const AWS = require('aws-sdk');
// const fs = require('fs');


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
  cron.schedule("*/3 * * * *", (callback) => {
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
        }


      ],

      function (err, result) {
        if (err) {
          //  callback(err);
          console.log(err);
        } else {
          //  callback();
          if(player === null || opponent === null)
          {
            console.log("No Match Found yet!!");
          }
          else{
            console.log("Successfully matched!!!!!!");
            // Controller.BattleBaseController.beginBattle(player.uid,player.fileUrl,opponent.uid,opponent.fileUrl);
          
            beginbattle(player.fileUrl,opponent.fileUrl);
          }
          
        }
      }
    );


  });

  const beginbattle =  (player1rurl,player2url) => {
   
    var spawn = require("child_process").spawn; 
    console.log("Files received Player 1: "+player1rurl+"\r\n");
    console.log("Files received Player 2: "+player2url);
    // var process = await spawn('python',["-u","./capture.py","--red","baselineTeam","--blue","myTeam"]); 
  
    // var process = spawn('python',['./capture.py',"--red","baselineTeam","--blue","myTeam"]); 
 
    // var process = spawn('python',['./capture.py',"--red="+player1rurl,"--blue="+player2url]); 
 
 
    var process = spawn('python',['./capture.py']); 
 
 
    let res1;
  
    process.stdout.on('data', async(data) =>{ 
   // res.send(data.toString());
   let result = data.toString();
   res1 = result.split(" ");
   console.log(res1[10]);
  
   let point = res1[23];
  
  //  var resultOverview = new Result({
  //    opponent: res1[7],
  //    winner : res1[19],
  //    points: res1[23]
  //  });
  
  //  try{
  //    await resultOverview.save();
  //  }
  //  catch(err){
  //    console.log("Error in saving the results onto the Database")
  //  }
  
  //  battleResult={
     
  //  }
   if(res1[19] == "Red"){
       console.log("Red is the winners");
  }
   if(res1[19] == "Blue"){
    console.log("Blue is the winners");
   }
   });


   process.stderr.on('data',(data)=>{
     console.log("Error Section Here"+data);
   });
   

  };
  

  // Start Server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};




process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
