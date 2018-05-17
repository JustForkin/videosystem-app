const {Video, LikedVideo, DislikedVideo, WatchLater} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const fs = require('fs')

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
          },
          order: [
            ['id', 'DESC']
          ]
        })
      } else {
        videos = await Video.findAll({
          where: {
            isPublic: true
          },
          order: [
            ['id', 'DESC']
          ]
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

  async addLike (req, res) {
    try {
      const currLikes = await LikedVideo.findOne({
        where: {
          id: req.params.videoId,
          username: req.user.username
        }
      })

      if (currLikes) {
        // ALREADY SET: remove like
        
      } else {
        // NOT SET: add like

      }

      /*const like = await LikedVideo.create({
        username: req.user.username,
        id: req.params.videoId
      })*/

      //res.send('+1 like from you')
    } catch (err) {
      res.status(400).send({
        error: err
      })
    }
  },

  async addView (req, res) {
    await Video.findById(req.params.videoId).then(video => {
      return video.increment({
        'views': 1
      })
    })
  },

  async watchInfo (req, res){
    try {
      const video = await Video.findById(req.params.videoId)
      if(!video){
        res.status(400).send({
          error: 'The video with the ID does not exist'
        })
      }

      if (video.dataValues.isPublic){
        res.send({
          likes: video.dataValues.likes,
          dislikes: video.dataValues.dislikes,
          views: video.dataValues.views,
          title: video.dataValues.title,
          description: video.dataValues.description,
          authorUsername: video.dataValues.authorUsername
        })

        /*await Video.findById(req.params.videoId).then(video => {
          return video.increment({
            'views': 1
          })
        })*/
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

  async watch (req, res){
    try {
      const video = await Video.findById(req.params.videoId)
      if(!video){
        res.status(400).send({
          error: 'The video with the ID does not exist'
        })
      }

      if (video.dataValues.isPublic){
        // -- START STREAM VIDEO HERE
        //res.send(video)
        console.log('on GET watch/videoId')
        const path = __dirname.replace('controllers', 'video-uploads/') + video.dataValues.videoFile
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range

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

  async upload (req, res) {
    // user
    console.log(req.user.username)
    // body
    console.log(req.body)
    // file
    console.log(req.file)

    if (!req.file) {
      console.log("No file received")
      return res.status(400).send({
        error: 'No file received'
      })
    } else {
      console.log('File received')

      // DB create
      try {
        let description = null
        if (req.body.description) {
          description = req.body.description
        }

        const video = await Video.create({
          title: req.body.title,
          isPublic: req.body.isPublic,
          countryId: req.body.countryId,
          description: description,
          videoFile: req.file.filename,
          authorUsername: req.user.username
        })

        const videoJson = video.toJSON()
        res.send({
          video: videoJson
        })
      } catch (err) {
        res.status(400).send({
          error: 'Something went wrong: ' + err
        })
      }
    }
  }
}
