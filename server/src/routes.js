const AuthenticationController = require ('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require ('./policies/AuthenticationControllerPolicy')

const multer = require('multer')
const upload = multer({dest: './video-uploads/'})

module.exports = (app) => {
  app.post(
    '/signup',
    AuthenticationControllerPolicy.signup,
    AuthenticationController.signup)

  app.post(
    '/login',
    AuthenticationController.login)

  app.post(
    '/upload',
    upload.single('videoFile'), (req, res, next) => {
      console.log(req.file)

    }
  )
}
