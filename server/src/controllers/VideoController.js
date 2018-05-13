const {Video} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  async videos (req, res){
    try {
      let videos = null
      const search = req.query.search
      if (search) {
        videos = await Video.findAll({
          where: {
            title: { [Op.like]: `%${search}%` },
            isPublic: true
          }
        })
      } else {
        videos = await Video.findAll({
          where: {
            isPublic: true
          }
        })
      }

      if (!videos.length) {
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
        res.send(videos)
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async watch (req, res){
    try {
      const video = await Video.findById(req.params.videoId)
      if(!video){
        res.status(400).send({
          error: 'The video with the ID does not exist'
        })
      }

      if (video.dataValues.isPublic){
        res.send(video)
      } else {
        res.status(400).send({
          error: 'This is the private video'
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async watchPrivate (req, res){
    try {
      const video = await Video.findOne({
        where: {
          authorUsername: req.user.username,
          id: req.params.videoId
        }
      })

      if (video) {
        res.send(video)
      } else {
        res.status(403).send({
          error: 'You have no access to the video'
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  upload (req, res) {

  }
}
