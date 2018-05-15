const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = function (req, res, next) {
  jwt.verify(req.token, config.authentication.jwtSecret, function(err, decoded) {
    console.log(decoded)
    console.log(err)
  })(req, res, next)
}
