const {Video, LikedVideo, DislikedVideo, WatchLater} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const fs = require('fs')

module.exports = {
  async videos (req, res){
    try {
      let videos = null
      const search = req.query.search
      const sortBy = req.query.sortBy

      var orderBy = [
        ['id', 'DESC']
      ]

      if (sortBy) {
        orderBy = [
          ['views', 'DESC']
        ]
      }

      if (search) {
        videos = await Video.findAll({
          where: {
            title: { [Op.iLike]: `%${search}%` },
            isPublic: true
          },
          order: orderBy
        })
      } else {
        videos = await Video.findAll({
          where: {
            isPublic: true
          },
          order: orderBy
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
        await LikedVideo.destroy({
          where: {
            id: req.params.videoId,
            username: req.user.username
          }
        })

        res.send({like: -1, dislike: 0})
      } else {
        // NOT SET: add like
        const currDislikes = await DislikedVideo.findOne({
          where: {
            id: req.params.videoId,
            username: req.user.username
          }
        })

        if (currDislikes) {
          await DislikedVideo.destroy({
            where: {
              id: req.params.videoId,
              username: req.user.username
            }
          })
        }

        await LikedVideo.create({
          username: req.user.username,
          id: req.params.videoId
        })

        res.send({
          like: 1,
          dislike: (currDislikes) ? -1 : 0
        })
      }
    } catch (err) {
      res.status(400).send({
        error: err
      })
    }
  },

  async addDislike (req, res) {
    try {
      const currDislikes = await DislikedVideo.findOne({
        where: {
          id: req.params.videoId,
          username: req.user.username
        }
      })

      if (currDislikes) {
        // ALREADY SET: remove dislike
        await DislikedVideo.destroy({
          where: {
            id: req.params.videoId,
            username: req.user.username
          }
        })

        res.send({like: 0, dislike: -1})
      } else {
        // NOT SET: add dislike
        const currLikes = await LikedVideo.findOne({
          where: {
            id: req.params.videoId,
            username: req.user.username
          }
        })

        if (currLikes) {
          await LikedVideo.destroy({
            where: {
              id: req.params.videoId,
              username: req.user.username
            }
          })
        }

        await DislikedVideo.create({
          username: req.user.username,
          id: req.params.videoId
        })

        res.send({
          like: (currLikes) ? -1 : 0,
          dislike: 1
        })
      }
    } catch (err) {
      res.status(400).send({
        error: err
      })
    }
  },

  async pointsByUser (req, res) {
    try {
      const currLikes = await LikedVideo.findOne({
        where: {
          id: req.params.videoId,
          username: req.user.username
        }
      })

      const currDislikes = await DislikedVideo.findOne({
        where: {
          id: req.params.videoId,
          username: req.user.username
        }
      })

      if (currLikes) {
        res.send({liked: true, disliked: false})
      }

      if (currDislikes) {
        res.send({liked: false, disliked: true})
      }

      res.send({liked: false, disliked: false})
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
          authorUsername: video.dataValues.authorUsername,
          id: video.dataValues.id
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

  async watchPrivateInfo (req, res){
    try {
      const video = await Video.findById(req.params.videoId)
      if(!video){
        res.status(400).send({
          error: 'The video with the ID does not exist'
        })
      }

      if (req.user.username != video.authorUsername) {
        res.status(403).send({
          error: 'You have no access to the video'
        })
      }

      res.send({
        likes: video.dataValues.likes,
        dislikes: video.dataValues.dislikes,
        views: video.dataValues.views,
        title: video.dataValues.title,
        description: video.dataValues.description,
        authorUsername: video.dataValues.authorUsername,
        id: video.dataValues.id
      })
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
      console.log('on >>> watchPrivate')
      const video = await Video.findOne({
        where: {
          id: req.params.videoId
        }
      })

      if (video) {
        // -- START STREAM VIDEO HERE
        // res.send(video)
        console.log('on GET videos/private/videoId')
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
          error: 'There is no video with the ID'
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async edit (req, res) {
    try {
      const video = await Video.findOne({
        where: {
          id: req.params.videoId
        }
      })

      if (video) {
        res.send({
          video: {
            authorUsername: video.dataValues.authorUsername,
            countryId: video.dataValues.countryId,
            description: video.dataValues.description,
            dislikes: video.dataValues.dislikes,
            id: video.dataValues.id,
            isPublic: video.dataValues.isPublic,
            likes: video.dataValues.likes,
            title: video.dataValues.title,
            uploadDate: video.dataValues.uploadDate,
            views: video.dataValues.views
          }
        })
      } else {
        res.status(400).send({
          error: 'There is no video with the ID'
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'Something went wrong: ' + err
      })
    }
  },

  async editSubmit (req, res) {
    try {
      if (req.user.username != req.body.authorUsername) {
        res.status(400).send({
          error: 'Something went wrong: ' + err
        })
        return
      }

      Video.update({
        title: req.body.title,
        description: req.body.description,
        countryId: req.body.countryId,
        isPublic: req.body.isPublic
      }, {
        where: {
          id: req.body.id
        }
      })

      res.status(200).send({
        success: 'The video has been successfully updated'
      })
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
