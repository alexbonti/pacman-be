var Service = require("../../services");
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
// var UploadManager = require('../../lib/uploadManager');
var TokenManager = require("../../lib/tokenManager");
var CodeGenerator = require("../../lib/codeGenerator");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require("underscore");
var UploadManager = require('../../lib/uploadManager');
var {v4:uuidv4} = require('uuid');
// const AWS = require('aws-sdk');
const fs = require('fs');
const path= require('path');
var UniversalFunctions = require("../../utils/universalFunctions");
var CONFIG = require("../../config");
var rimraf = require("rimraf");



//start Game
var startGame = function (userData, callback) {
    let mode = userData.demoMode;
    console.log(mode);

    //Demo Mode Game procedure
    if(mode == true){
    console.log("True here");
    console.log(userData.fileUrlIndex);
    var spawn = require("child_process").spawn; 
    

    const path = require('path');
   
    // const user1file = path.basename(player1url);
  
    let winner;
    let loser;
    let winnerName;
    let loserName;
    let winnerDetails;
    let loserDetails;
    let winnerMargin=0;
    let gameId = uuidv4();
    var documentFileUrl;
    let userAdditionalInfo = '';
    let fIndex = '';
    let userAlreadyWaiting = '';
    let player1id = '';
    let user1file='';
    let x = false;
    let player1name = userData.firstName;

      async.series(
        [
          function (cb) {
            fIndex = parseInt(userData.fileUrlIndex);
  
            var query = {
              playerId: userData._id
            };
            var projection = {
              __v: 0
            };
            var options = { lean: true };
            
            Service.UserService.getUserInfo(query, projection, options, function (
              err,
              data
            ) {
              if (err) {
                cb(err);
              } else {
                  userAdditionalInfo = (data && data[0]) || null;
                  console.log("Additional Information fetched complete and correctly for the user");
                  cb();
                
              }
            });
          },
          function (cb) {
            player1id = userAdditionalInfo.playerId;
            // console.log(userAdditionalInfo.fileName[fIndex]);
            // console.log(userData.firstName);
            user1file = path.basename(userAdditionalInfo.models[fIndex]);
            UploadManager.getItem(user1file,player1id,function(err,data){
              if (err) cb(err);
              else {
                cb(null);
              }
          }); 
              
          },
          
          function (cb) {
            const p = require("process");
            var file = p.cwd()+'/berkeley/capture.py';
            console.log(file);
            var process = spawn('python2',[file,"--snapshotsFolder="+gameId,"--red="+player1id+'.py',"--blue="+'baselineTeam.py']); 
            let res1;
          
            process.stdout.on('data', async(data) =>{ 
             let result = data.toString();
             res1 = result.split(" ");
             console.log(res1[10]);
          
          
             if(res1[19] == "Red"){
               winner = player1id;
               winnerMargin = res1[23];
               x = true;
               console.log("Player 1  winner");
               //cb(null);
              }
              else if(res1[19] == "Blue"){
               loserName = player1name;
               winnerMargin = Math.abs(parseInt(res1[23]));
               console.log("Player 1 lost");
               //cb(null);
              }
              else{
                winner = player1id;
                loser = "123456";
                winnerName = 'Draw';
                winnerMargin = 0;
                console.log("Player 1 plays a Drawn case");
                //cb(null);
              }
           });
           
           process.stdout.on('end', async(data) =>{ 
               cb();
            });
        
        
           process.stderr.on('data',(data)=>{
             console.log(data);
             console.log("Error Section Here"+data);
             
           });
           
          
          },
  
            //Update Details Accordingly for the Winner
            function (cb) {
              let matchesPlayed = userAdditionalInfo.matchesPlayed;
              matchesPlayed++;
              let matchesWon;
              let highestScore;
              let dataToSet;

              if(x == true){
                matchesWon = userAdditionalInfo.matchesWon;
               
                if(winnerMargin>0){
                 matchesWon++;
                }
                
                highestScore = parseInt(userAdditionalInfo.highestScore);
                if(winnerMargin>highestScore){
                  highestScore = winnerMargin;
                }
                 dataToSet = {
                  matchesPlayed,
                  matchesWon,
                  highestScore
                }
     
              }
              else{
                matchesWon = userAdditionalInfo.matchesWon;
               
                highestScore = parseInt(userAdditionalInfo.highestScore);
                if(winnerMargin>highestScore){
                  highestScore = winnerMargin;
                }
                 dataToSet = {
                  matchesPlayed,
                  matchesWon,
                  highestScore
                }
     
              }
    
              
              var query = {
                playerId: userData._id
               };
               var options = { lean: true };
               Service.UserService.updateUserAdditionalInfo(query, dataToSet, { useFindAndModify: false }, function (
                 err,
                 data
               ) {
                 if (err) {
                   cb(err);
                 } else {
                   console.log("Data Modified");
                   cb();
                 }
               });
             
  
            },
    
            //Store the Video File 
            function (cb) {
              var fileContent = gameId;
              
              UploadManager.uploadVideo(fileContent, CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.files, UniversalFunctions.generateRandomString(), function (err, uploadedInfo) {
                if (err) {
                  console.log("Issue in Video UPload");
                  cb(err)
                } else {
                  documentFileUrl = {
                    original: uploadedInfo.profilePicture,
                    fileName : 'video.mp4'
                  }
                  console.log("Video Saved buddy");
                  console.log(documentFileUrl);
                  cb();
                }
              });
            
            },
  
            function (cb){
  
              let battleDetails= {};
              if(winnerMargin == 0){
                battleDetails =  {
                  Player1: player1name,
                  Player2: "Demo",
                  Winner: "Draw",
                  Margin: winnerMargin,
                  Highlights: documentFileUrl.original
                };
              }
              else{
              if(x == true){
                 battleDetails =  {
                  Player1: player1name,
                  Player2: "Demo",
                  Winner: player1name,
                  Margin: winnerMargin,
                  Highlights: documentFileUrl.original
                };
              }

              else{
                 battleDetails =  {
                  Player1: player1name,
                  Player2: "Demo",
                  Winner: "Demo",
                  Margin: winnerMargin,
                  Highlights: documentFileUrl.original
                };
              }
            }
              
    
              Service.LeaderBoardService.addIntoLeaderBoard(battleDetails, function(err,data){
                if(err){
                   cb(err);
                }else{
                  console.log("Added into the Leaderboard");
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
              fs.unlink(player1id+'.pyc', function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
                cb();
            });
           
            },
           
  
            //Delete the associated screenshots and video with the game
            function (cb) {
              rimraf("./"+gameId, function () { 
                console.log("done deleting the required folder");
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
  
  





    }
    else{
    let userAdditionalInfo = '';
    let fIndex = '';
    let userAlreadyWaiting = '';
    async.series(
      [
        function (cb) {
          fIndex = parseInt(userData.fileUrlIndex);

          var query = {
            playerId: userData._id
          };
          var projection = {
            __v: 0
          };
          var options = { lean: true };
          
          Service.UserService.getUserInfo(query, projection, options, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
                userAdditionalInfo = (data && data[0]) || null;
                console.log("Additional Information fetched complete and correctly for the user");
                cb();
              
            }
          });
        },
        function (cb) {
          var query = {
            uid: userData._id
          };
          var projection = {
            __v: 0
          };
          var options = { lean: true };
          
          Service.BattleService.findPlayer(query, projection, options, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
                userAlreadyWaiting = (data && data[0]) || null;
                console.log("Additional Information fetched complete and correctly for the user");
                cb();
              
            }
          });
        },
        function (cb) {

          if(userAlreadyWaiting != null){
            cb();
          }
          else{
          fUrl = userAdditionalInfo.models[fIndex];
         
          dataToSave = {uid: userData._id, fileUrl : fUrl, matched: false, username: userData.firstName };
          
          Service.BattleService.createBattle(dataToSave, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } else {
                console.log("Data Stored Perfectly");
                cb();
              
            }
          });
         } 
        }
      ],
      function (err, result) {
        if (err) {
          callback(err);
          console.log(err+"in the backend for the required model selection");
        }
        else callback(null, { "msg": 1 });
      }
    );
    }

  };



  //Get leaderboard
  var getLeaderBoard = function (callback) {
    var battleResults;
    async.series(
      [
        function (cb) {
          var query = {};
          var projection = {  __v: 0, _id: 0};
          var options = { lean: true };
          Service.LeaderBoardService.fetchBattleResults(query, projection, options, function (
            err,
            data
          ) {
            if (err) {
              cb(err);
            } 
              else {
                battleResults = (data ) || null;
                cb();
              }
            
          });
        }
      ],
      function (err, result) {
        if (err) callback(err);
        else callback(null, { battleResults : battleResults });
      }
    );
  };

  //Begin Battle
  var beginBattle = function (u1id, u1file, u2id, u2file)  {


  
     /* Using Child Spawn function */
     var spawn = require("child_process").spawn; 
     // var process = await spawn('python',["-u","./capture.py","--red","baselineTeam","--blue","myTeam"]); 
   
     var process =  spawn('python',["-u",'./capture.py']); 
   
     let res1;
   
     process.stdout.on('data', async(data) =>{ 
    // res.send(data.toString());
    let result = data.toString();
    res1 = result.split(" ");
    console.log(res1);
   
   //  let point = res1[23];
   
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
      return res.status(200).json({msg:"You won by "+point+" points"});     
    }
    if(res1[19] == "Blue"){
      return res.status(200).json({msg:"You lost by "+point+" points"});
    }
    });
     
  }

  module.exports = {
      startGame : startGame,
      beginBattle: beginBattle,
      getLeaderBoard: getLeaderBoard
  }
