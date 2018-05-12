const AuthenticationController = require ('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require ('./policies/AuthenticationControllerPolicy')

const VideoController = require ('./controllers/VideoController')
const multer = require('multer')
const {Video} = require('./models')
const randomstring = require('randomstring')

var storage = multer.diskStorage({
    destination: __dirname + '/video-uploads',
    filename: function(req, file, callback) {
      callback(null, Date.now() + "_" + randomstring.generate(32) + "_" + file.originalname)
    }
})

module.exports = (app) => {
  app.post(
    '/signup',
    AuthenticationControllerPolicy.signup,
    AuthenticationController.signup)

  app.post(
    '/login',
    AuthenticationController.login)

  app.post('/upload', multer({storage: storage}).single('videoFile'), async (req, res) => {
    // body
    console.log(req.body)

    try {
      const video = await Video.create(req.body)
      const videoJson = video.toJSON()
      res.send({
        video: videoJson
      })
    } catch (err) {
      res.status(400).send({
        error: err
      })
    }

    // file
    console.log(req.file)

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

    if (!mimetypes.includes(req.file.mimetype)){
      return res.status(400).send({
        error: 'The type of the file is not supported'
      })
    }

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
