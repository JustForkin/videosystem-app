const AuthenticationController = require ('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require ('./policies/AuthenticationControllerPolicy')

const VideoController = require ('./controllers/VideoController')
const multer = require('multer')
const {Video} = require('./models')
const randomstring = require('randomstring')

const isAuthenticated = require('./policies/isAuthenticated')

var storage = multer.diskStorage({
    destination: __dirname + '/video-uploads',
    filename: function(req, file, callback) {
      callback(null, Date.now() + "_" + randomstring.generate(32) + "_" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  const mimetypes = [
    'video/3gpp',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/quicktime',
    'video/mpeg',
    'video/webm',
    'video/x-m4v',
    'video/ms-asf',
    'video/x-ms-wmv',
    'video/x-msvideo']

  // reject a file
  if (mimetypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
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

  // videos
  app.get(
    '/videos',
    VideoController.videos)
  app.get(
    '/videos/:videoId',
    VideoController.watch)
  app.get(
    '/videos/private/:videoId',
    isAuthenticated,
    VideoController.watchPrivate)

  app.post('/upload', upload.single('videoFile'), /*async*/ (req, res, next) => {
    // body
    console.log(req.body)

    /*try {
      const video = await Video.create(req.body)
      const videoJson = video.toJSON()
      res.send({
        video: videoJson
      })
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }*/

    // file
    console.log(req.file)

    if (!req.file) {
      console.log("No file received")
      return res.send({
        success: false
      })

    } else {
      console.log('File received')
      return res.send({
        success: true
      })
    }
  })
}
