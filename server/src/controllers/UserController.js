const {User, Video} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('../config/config')
const fs = require('fs')
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

      const orderBy = [['registerDate']]

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

      if (!user) {
        res.status(400).send({
          error: 'The user does not exist'
        })
      } else {
        // user exists
        let videos = []
        videos = await Video.findAll({
          where: {
            isPublic: true,
            authorUsername: req.params.username
          },
          order: [['id', 'DESC']]
        })

        res.send({
          user: user,
          videos: videos
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async myProfile (req, res) {
    try {
      var user = await User.findOne({
        where: {
          username: req.user.username
        },
        attributes: attributesToShow
      })

      let videos = []
      videos = await Video.findAll({
        where: {
          authorUsername: req.user.username
        },
        order: [['id', 'DESC']]
      })

      res.send({
        user: user,
        videos: videos
      })
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async updateMyProfile (req, res) {
    try {
      if (req.user.username != req.body.username) {
        res.status(403).send({
          error: 'You do not have access to edit the profile'
        })
      }

      User.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        gender: req.body.gender,
        about: req.body.about
      }, {
        where: {
          username: req.body.username
        }
      })

      res.status(200).send({
        success: 'User profile has been successfully updated'
      })
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async removeMyProfile (req, res) {
    try {
      if (req.user.username != req.body.username) {
        res.status(403).send({
          error: 'You do not have access to remove the profile'
        })
      }

      // remove all videos
      const videos = await Video.findAll({
        where: {
          authorUsername: req.body.username
        }
      })

      if (videos.length) {
        for (var i = 0; i < videos.length; i++) {
          var path = __dirname.replace('controllers', 'video-uploads/') + videos[i].dataValues.videoFile
          fs.unlink(path, (err) => {
            if (err) throw err
            console.log(path + ' file was deleted');
          })
        }
      }

      // delete DB data
      await Video.destroy({
        where: {
          authorUsername: req.body.username
        }
      })
      await User.destroy({
        where: {
          username: req.body.username
        }
      })

      res.status(200).send({
        success: 'User profile has been successfully removed'
      })
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  }
}
