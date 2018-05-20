const {User, Video} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('../config/config')
var sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options)

const attributesToShow = [
  "username", "firstname", "lastname",
  "birthday", "gender", "about",
  "registerDate", "isAdmin"]

module.exports = {
  async users (req, res) {
    try {
      let users = []
      const search = req.query.search
      const sortBy = req.query.sortBy

      const orderBy = [['registerDate', 'DESC']]

      if (!sortBy) {
        if (search) {
          users = await User.findAll({
            where: {
              username: { [Op.iLike]: `%${search}%` }
            },
            order: orderBy,
            attributes: attributesToShow
          })
        } else {
          users = await User.findAll({
            order: orderBy,
            attributes: attributesToShow
          })
        }
      } else {
        // sortBy=popularity
        if (search) {
          await sequelize.query('SELECT * FROM "user_popularity_search"(\'%' + search + '%\')', {
            type: Sequelize.QueryTypes.SELECT
          }).then(_users => {
              users = _users
            })
        } else {
          await sequelize.query('SELECT * FROM "user_popularity_search"(\'%%\')', {
            type: Sequelize.QueryTypes.SELECT
          }).then(_users => {
              users = _users
            })
        }
      }

      // after DB query
      if (!users.length) {
        if (!search){
          res.status(400).send({
            error: 'No videos'
          })
        } else {
          res.status(400).send({
            error: 'No videos mathing the query: ' + search
          })
        }
      } else {
        res.send(users)
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async profile(req, res) {
    try {
      let user = null
      user = await User.findOne({
        where: {
          username: req.params.username
        },
        attributes: attributesToShow
      })

      // after DB query
      if (!user) {
        res.status(400).send({
          error: 'The user does not exist'
        })
      } else {
        res.send(user)
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  }
}
