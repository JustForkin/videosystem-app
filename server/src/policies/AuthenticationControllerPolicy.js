const Joi = require('joi')

module.exports = {
  signup (req, res, next) {
    const schema = {
      username: Joi.string().min(5).max(30).token().required(),
      password: Joi.string().min(8).max(30).token().required()
    }

    const {error} = Joi.validate(req.body, schema)

    if (error){
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'The username provided failed to match the following rules:<br>1. It must contain ONLY the following characters: lower case, upper case, numerics and underscore.<br>2. It must be at least 5 characters in length and not greater than 30 characters in length.'
          })
          break
        case 'password':
          res.status(400).send({
            error: 'The password provided failed to match the following rules:<br>1. It must contain ONLY the following characters: lower case, upper case, numerics and underscore.<br>2. It must be at least 8 characters in length and not greater than 30 characters in length.'
          })
          break
        default:
          res.status(400).send({
            error: 'Invalid registration information'
          })
      }
    } else {
      next()
    }
  }
}
