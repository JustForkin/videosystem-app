const {Country} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  async countries (req, res){
    try {
      let countries = null
      countries = await Country.findAll()
      res.send(countries)
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  }
}
