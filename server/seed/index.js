const {
  sequelize,
  Country,
  User,
  Video
} = require('../src/models')

const Promise = require('bluebird')

const countries = require('./countries.json')
const users = require('./users.json')
const videos = require('./videos.json')

sequelize.sync({force: true})
  .then(async function () {
    await Promise.all(
      countries.map(country => {
        Country.create(country)
      })
    )

    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )

    await Promise.all(
      videos.map(video => {
        Video.create(video)
      })
    )
  })
