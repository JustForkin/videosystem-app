const AuthenticationController = require ('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require ('./policies/AuthenticationControllerPolicy')

const CountryController = require ('./controllers/CountryController')

const UserController = require ('./controllers/UserController')

const VideoController = require ('./controllers/VideoController')
const multer = require('multer')
const {Video} = require('./models')
const randomstring = require('randomstring')
const fs = require('fs')

const isAuthenticated = require('./policies/isAuthenticated')

var storage = multer.diskStorage({
    destination: __dirname + '/video-uploads',
    filename: function(req, file, callback) {
      callback(null, Date.now() + "_" + randomstring.generate(32) + "_" + file.originalname)
    }
})

var fileFilter = (req, file, cb) => {
  const mimetypes = [
    'video/mp4',
    'video/ogg',
    'video/webm']

  // reject a file
  if (mimetypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 10 // 10 GB
  },
  fileFilter: fileFilter
})

module.exports = (app) => {
  // authorization
  app.post(
    '/signup',
    AuthenticationControllerPolicy.signup,
    AuthenticationController.signup)
  app.post(
    '/login',
    AuthenticationController.login)

  // countries
  app.post(
    '/countries',
    CountryController.countries)

  // videos
  app.get(
    '/videos',
    VideoController.videos)
  app.get(
    '/videos/:videoId',
    VideoController.watch)
  app.post(
    '/videos/:videoId',
    VideoController.watchInfo)
  app.post(
    '/videos/:videoId/addLike',
    isAuthenticated,
    VideoController.addLike)
  app.post(
    '/videos/:videoId/addDislike',
    isAuthenticated,
    VideoController.addDislike)
  app.post(
    '/videos/:videoId/pointsByUser',
    isAuthenticated,
    VideoController.pointsByUser)
  app.post(
    '/videos/:videoId/addView',
    VideoController.addView)
  app.get(
    '/videos/private/:videoId',
    isAuthenticated,
    VideoController.watchPrivate)
  app.post(
    '/upload',
    isAuthenticated,
    upload.single('videoFile'),
    VideoController.upload)
  app.post(
    '/videos/publicVideosOfUser/:username',
    VideoController.publicVideosOfUser)


  // users
  app.get(
    '/users',
    UserController.users)
  app.get(
    '/users/:username',
    UserController.profile)
  app.post(
    '/users/:username',
    UserController.profile)
}
