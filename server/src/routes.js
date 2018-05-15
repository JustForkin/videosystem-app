const AuthenticationController = require ('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require ('./policies/AuthenticationControllerPolicy')

const VideoController = require ('./controllers/VideoController')
const multer = require('multer')
const {Video} = require('./models')
const randomstring = require('randomstring')
const progress = require('progress-stream')
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

var p = progress({time: 100})

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

  app.get('/watchexample', (req, res, next) => {
    console.log('called GET watchexample/ from back-end')
    const path = __dirname + '/video-uploads/' + '1526378034036_nzjFjx15pRM2KIVNdJFDKroxS0Sau2UF_10 Rotating Fog Cloud.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range //

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  })
}
