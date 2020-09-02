/**
 * Please use appLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 */

var UniversalFunctions = require("../../utils/universalFunctions");
var UploadManager = require("../../lib/uploadManager");
var CONFIG = require("../../config");
var async = require("async");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var checkFileExtension = function(fileName){
    return fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName;
}

var uploadImage = function (payloadData, callback) {
  var imageFileURL;
  var imageFile = payloadData.imageFile
  if (payloadData.imageFile && payloadData.imageFile.filename) {
    imageFileURL = {
      original: null,
      thumbnail: null
    }
  }
  appLogger.info("????????",checkFileExtension(imageFile.hapi.filename))
  async.series([
    function (cb) {
      if (payloadData.hasOwnProperty("imageFile") && imageFile && imageFile.hapi.filename) {
        UploadManager.uploadProfilePicture(imageFile, CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.image, UniversalFunctions.generateRandomString(), function (err, uploadedInfo) {
          if (err) {
            cb(err)
          } else {
            imageFileURL = {
              original: uploadedInfo.profilePicture,
              thumbnail: uploadedInfo.profilePictureThumb
            }
            cb();
          }
        });
      }
      else {
        cb()
      }
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { imageFileURL: imageFileURL })
  })
}

var uploadDocument = function (payloadData, callback) {
  var documentFileUrl;
  var documentFile = payloadData.documentFile;
  
  if (payloadData.documentFile && payloadData.documentFile.filename) {
    documentFileUrl = {
      original: null
    }
  }
  async.series([
    function (cb) {
      if (payloadData.hasOwnProperty("documentFile") && documentFile && documentFile.hapi.filename) {
        UploadManager.uploadfileWithoutThumbnail(documentFile, CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.files, UniversalFunctions.generateRandomString(), function (err, uploadedInfo) {
          if (err) {
            cb(err)
          } else {
            documentFileUrl = {
              original: uploadedInfo.profilePicture,
              fileName : documentFile.hapi.filename
            }
            cb();
          }
        });
      }
      else {
        cb()
      }
    }
  ], function (err, result) {
    if (err) callback(err)
    else {
      console.log(documentFileUrl);
      callback(null, { documentFileUrl: documentFileUrl })
    }
  })
}

module.exports = {
  uploadImage: uploadImage,
  uploadDocument: uploadDocument
};
