const BaseJoi = require('joi')
const jde = require('joi-date-extensions')
const Joi = BaseJoi.extend(jde)

module.exports = {
  signup (req, res, next) {
    const schema = {
      username: Joi.string().min(5).max(30).token().required(), // "user_one_1"
      password: Joi.string().min(8).max(30).token().required(), // "password_one_1"
      firstname: Joi.string().regex(/^[a-zA-Z]+$/).min(1).max(30).required(), // "George"
	    lastname: Joi.string().regex(/^[a-zA-Z]+$/).min(1).max(30), // "Moon"
	    birthday: Joi.date().format('YYYY-MM-DD').max('now').min('1920-01-01'), // .regex(/^\d{4}\-\d{2}\-\d{2}$/), // "1998-04-04"
	    gender: Joi.string().valid(['Male', 'Female']).required(), // "Male" or "Female"
	    about: Joi.string() // "about me ..."
    }

    const {error} = Joi.validate(req.body, schema)

    // TODO: EXPAND THE CASES for different error cases
    
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
        case 'firstname':
          res.status(400).send({
            error: 'First Name must contain only letters (a-z)'
          })
          break
        case 'lastname':
          res.status(400).send({
            error: 'Last Name must contain only letters (a-z)'
          })
          break
        case 'birthday':
          res.status(400).send({
            error: 'Birthday cannot be: later than today / earlier than 1920-01-01 / format must be like: YYYY-MM-DD'
          })
          break
        case 'gender':
          res.status(400).send({
            error: 'Gender should be one of these: Male / Female'
          })
          break
        case 'about':
          res.status(400).send({
            error: 'About info contains errors'
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
