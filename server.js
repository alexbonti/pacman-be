

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
var UploadManager = require('./lib/uploadManager');
// const AWS = require('aws-sdk');
const fs = require('fs');


const init = async () => {
  //Create Server
  var server = new Hapi.Server({
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.PORT || 8000,
    routes: { cors: true },
    routes: {
      cors: {
          origin: ["*"],
          headers: ["Accept", "Content-Type"],
          additionalHeaders: ["X-Requested-With"]
      }
  }
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
  cron.schedule("*/5 * * * * *", (callback) => {
    let player;
    let opponent;
    let matchDone = false;
    let result;
    let winner, winnerDetails;
    let loser, loserDetails;
    console.log("Cron started Mate!!");
    async.series(
      [
        function (cb) {

          let criteria ={
            matched : false
          }

          Service.BattleService.findPlayer(criteria, {}, { limit: 1 }, function (
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
                console.log("No More Players Found Waiting");
                player = null;
                cb();
              }

            
            }

          })
        },


        function (cb) {

          if(player === null){
            cb();
          }

          else{

          Service.BattleService.findPlayer({ _id: { $ne: player._id } , matched : false }, {}, { limit: 1 }, function (
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
                matchDone = true;
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
        },

        function (cb) {

          if(player === null || opponent === null){
            cb();
          }

          else{

            let matched = true;
            let dataToSet = {
              matched
            }
 
           var query = {
             _id: player._id
            };
            var options = { lean: true };
            Service.BattleService.updateBattle(query, dataToSet, { useFindAndModify: false }, function (
              err,
            data
          ) {
            if (err) {
              cb(err);
              console.log(err);
            } else {
                cb();
              }
             
            }

          )

          }
        },

        function (cb) {

          if(player === null || opponent === null){
            cb();
          }

          else{

            let matched = true;
            let dataToSet = {
              matched
            }
 
           var query = {
             _id: opponent._id
            };
            var options = { lean: true };
            Service.BattleService.updateBattle(query, dataToSet, { useFindAndModify: false }, function (
              err,
            data
          ) {
            if (err) {
              cb(err);
              console.log(err);
            } else {
                cb();
              }
             
            }

          )

          }
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
          
            beginbattle(player.fileUrl,player.uid,player.username,opponent.fileUrl,opponent.uid,opponent.username);
            }
            
          
          
        }
      }
    );


  });

  const beginbattle =  (player1url,player1id,player1name,player2url,player2id,player2name) => {
   
    var spawn = require("child_process").spawn; 
    console.log("Files received Player 1: "+player1url+"\r\n");
    console.log("Files received Player 2: "+player2url);

    const path = require('path');
    const user1file = path.basename(player1url);
    const user2file = path.basename(player2url);

    let winner;
    let loser;
    let winnerName;
    let loserName;
    let winnerDetails;
    let loserDetails;
    let winnerMargin=0;


    async.series(
      [
        function (cb) {
          UploadManager.getItem(user1file,player1id,function(err,data){
            if (err) cb(err);
            else {
              cb(null);
            }
        }); 
            
        },
        function (cb) {
          UploadManager.getItem(user2file,player2id,function(err,data){
            if (err) cb(err);
            else {
              cb(null);
            }
        }); 
            
        },
        function (cb) {
          
          var process = spawn('python',['./capture.py',"--red="+player1id+'.py',"--blue="+player2id+'.py']); 
          let res1;
        
          process.stdout.on('data', async(data) =>{ 
           let result = data.toString();
           res1 = result.split(" ");
           console.log(res1[10]);
        
        
           if(res1[19] == "Red"){
             winner = player1id;
             loser = player2id;
             winnerName = player1name;
             loserName = player2name;
             winnerMargin = res1[23];
             cb();
            }
            else if(res1[19] == "Blue"){
             winner = player2id;
             loser = player1id;
             winnerName = player2name;
             loserName = player1name;
             winnerMargin = Math.abs(parseInt(res1[23]));
             cb();
            }
            else{
              winner = player1id;
              loser = player2id;
              winnerName = 'Draw';
              winnerMargin = 0;
              cb();
            }
         });
      
      
         process.stderr.on('data',(data)=>{
           console.log("Error Section Here"+data);
         });
         
        
        },

        function (cb) {
  
             Service.UserService.getUserInfo({ playerId: winner }, {}, {}, function (err, data) {
               if (err) {
                 console.log("Error in fetching the Details of the WIinner");
                 cb(err);
               }
               else {
                 winnerDetails = data && data[0] || null;
                 console.log("Winner Details" + winnerDetails);
                 cb();
               }
             })
          
          },
  
          //Update Details Accordingly for the Winner
          function (cb) {
  
             let matchesPlayed = winnerDetails.matchesPlayed;
             matchesPlayed++;
             let matchesWon = winnerDetails.matchesWon;
             
             if(winnerMargin>0){
              matchesWon++;
             }
             
             let highestScore = parseInt(winnerDetails.highestScore);
             if(winnerMargin>highestScore){
               highestScore = winnerMargin;
             }
             let dataToSetForWinner = {
               matchesPlayed,
               matchesWon,
               highestScore
             }
  
            var query = {
              playerId: winner
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
           

          },
  
          //Fetch the Loser Details
          function (cb) {
  
             Service.UserService.getUserInfo({ playerId: loser }, {}, {}, function (err, data) {
               if (err) {
                 console.log("Error in fetching the Details of the Loser");
              }
               else {
                 loserDetails = data && data[0] || null;
                 cb();
               }
             })
          
         
          },
  
          //Update Details Accordingly for the Loser Accordingly
          function (cb) {
    
            let matchesPlayed = loserDetails.matchesPlayed;
             matchesPlayed++;
             let dataToSetForLoser = {
               matchesPlayed,
             }
  
             var query = {
               playerId: loser
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

          },

          function (cb){
            let battleDetails =  {
              Player1: player1name,
              Player2: player2name,
              Winner: winnerName,
              Margin: winnerMargin
            };
  
            Service.LeaderBoardService.addIntoLeaderBoard(battleDetails, function(err,data){
              if(err){
                 cb(err);
              }else{
                console.log("Added into the Leaderboard");
                cb();
              }
            })
          },
  
          //Now Delete the Winner Record from Battle Collection
          function (cb) {
  
             Service.BattleService.deleteBattle({ uid : winner }, function (err, data) {
               if (err) {
                 console.log("Error in fexecuting the Delete Operation");
               }
               else {
                 console.log("Winner Record Deleted Successfully");
                 winner = null;
                 winnerDetails = null;
                 cb();
               }
             })
           
          
          },
  
          //Delete the record for the Loser from the Battle Collection
          function (cb) {
  
             Service.BattleService.deleteBattle({ uid : loser._id }, function (err, data) {
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
          
          
          },

          function (cb) {
            fs.unlink(player1id+'.py', function (err) {
              if (err) throw err;
              // if no error, file has been deleted successfully
              console.log('File deleted!');
              cb();
          });
         
          },
          function (cb) {
            fs.unlink(player2id+'.py', function (err) {
              if (err) throw err;
              // if no error, file has been deleted successfully
              console.log('File deleted!');
              cb();
          });
         
          },

          function (cb) {
            fs.unlink(player1id+'.pyc', function (err) {
              if (err) throw err;
              // if no error, file has been deleted successfully
              console.log('File deleted!');
              cb();
          });
         
          },
          function (cb) {
            fs.unlink(player2id+'.pyc', function (err) {
              if (err) throw err;
              // if no error, file has been deleted successfully
              console.log('File deleted!');
              cb();
          });
         
          }

         
  
      ],
      function (err, user) {
        if (!err)
          {
            console.log("Game Logic Done");
          }
        else {
          console.log(err);
          console.log("Error in Operations");
        }
      }
    );


    

  };
  

  // Start Server
  await server.start();
  console.log("Server running on %s", server.info.uri);
  console.log(process.env.PORT);
  console.log(process.env.HAPI_PORT);
};




process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
