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
    VideoController.watchPrivate)
  app.post(
    '/videos/private/:videoId',
    isAuthenticated,
    VideoController.watchPrivateInfo)
  app.get(
    '/videos/edit/:videoId',
    isAuthenticated,
    VideoController.edit)
  app.post(
    '/videos/edit/:videoId',
    isAuthenticated,
    VideoController.editSubmit)
  app.post(
    '/videos/edit/remove/:videoId',
    isAuthenticated,
    VideoController.editRemove)
  app.post(
    '/upload',
    isAuthenticated,
    upload.single('videoFile'),
    VideoController.upload)

  // users
  app.get(
    '/users',
    UserController.users)
  app.get(
    '/users/:username',
    UserController.profile)
  app.get(
    '/me',
    isAuthenticated,
    UserController.myProfile)
  app.get(
    '/me/edit',
    isAuthenticated,
    UserController.myProfile)
  app.post(
    '/me/edit',
    isAuthenticated,
    UserController.updateMyProfile)
  app.post(
    '/me/remove',
    isAuthenticated,
    UserController.removeMyProfile)
}
