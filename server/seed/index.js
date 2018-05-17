const {
  sequelize,
  Country,
  User,
  Video,
  LikedVideo
} = require('../src/models')

const Promise = require('bluebird')

const countries = require('./countries.json')
const users = require('./users.json')
const videos = require('./videos.json')
const likedVideos = require('./likedVideos.json')

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

    // Likes trigger
    sequelize.query(
      '﻿CREATE OR REPLACE FUNCTION "trace_likes_f"() ' +
      'RETURNS TRIGGER AS $$ ' +
      'BEGIN ' +
      'UPDATE "Videos" ' +
      'SET "likes" = "likes" + 1 ' +
      'WHERE "Videos"."id" = NEW."id"; ' +
      'RETURN NEW; ' +
      'END; ' +
      '$$ LANGUAGE PLPGSQL; ' +

      'CREATE TRIGGER "trace_likes" ' +
      'AFTER INSERT ' +
      'ON "LikedVideos" ' +
      'FOR EACH ROW ' +
      'EXECUTE PROCEDURE "trace_likes_f"();')

    await Promise.all(
      likedVideos.map(likedVideo => {
        LikedVideo.create(likedVideo)
      })
    )
  })
