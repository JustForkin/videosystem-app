const {
  sequelize,
  Country,
  User,
  Video,
  LikedVideo,
  DislikedVideo,
  WatchLater
} = require('../src/models')

const Promise = require('bluebird')

const countries = require('./countries.json')
const users = require('./users.json')
const videos = require('./videos.json')
const likedVideos = require('./likedVideos.json')
const dislikedVideos = require('./dislikedVideos.json')
const watchLater = require('./watchLater.json')

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

    // Likes back trigger
    sequelize.query(
      '﻿CREATE OR REPLACE FUNCTION "trace_likes_back_f"() ' +
      'RETURNS TRIGGER AS $$ ' +
      'BEGIN ' +
      'UPDATE "Videos" ' +
      'SET "likes" = "likes" - 1 ' +
      'WHERE "Videos"."id" = OLD."id"; ' +
      'RETURN NEW; ' +
      'END; ' +
      '$$ LANGUAGE PLPGSQL; ' +

      'CREATE TRIGGER "trace_likes_back" ' +
      'AFTER DELETE ' +
      'ON "LikedVideos" ' +
      'FOR EACH ROW ' +
      'EXECUTE PROCEDURE "trace_likes_back_f"();')

    // disLikes trigger
    sequelize.query(
      '﻿CREATE OR REPLACE FUNCTION "trace_dislikes_f"() ' +
      'RETURNS TRIGGER AS $$ ' +
      'BEGIN ' +
      'UPDATE "Videos" ' +
      'SET "dislikes" = "dislikes" + 1 ' +
      'WHERE "Videos"."id" = NEW."id"; ' +
      'RETURN NEW; ' +
      'END; ' +
      '$$ LANGUAGE PLPGSQL; ' +

      'CREATE TRIGGER "trace_dislikes" ' +
      'AFTER INSERT ' +
      'ON "DislikedVideos" ' +
      'FOR EACH ROW ' +
      'EXECUTE PROCEDURE "trace_dislikes_f"();')

    // disLikes trigger
    sequelize.query(
      '﻿CREATE OR REPLACE FUNCTION "trace_dislikes_back_f"() ' +
      'RETURNS TRIGGER AS $$ ' +
      'BEGIN ' +
      'UPDATE "Videos" ' +
      'SET "dislikes" = "dislikes" - 1 ' +
      'WHERE "Videos"."id" = OLD."id"; ' +
      'RETURN NEW; ' +
      'END; ' +
      '$$ LANGUAGE PLPGSQL; ' +

      'CREATE TRIGGER "trace_dislikes_back" ' +
      'AFTER DELETE ' +
      'ON "DislikedVideos" ' +
      'FOR EACH ROW ' +
      'EXECUTE PROCEDURE "trace_dislikes_back_f"();')

    await Promise.all(
      likedVideos.map(likedVideo => {
        LikedVideo.create(likedVideo)
      })
    )

    await Promise.all(
      dislikedVideos.map(dislikedVideo => {
        DislikedVideo.create(dislikedVideo)
      })
    )

    await Promise.all(
      watchLater.map(watchLater => {
        WatchLater.create(watchLater)
      })
    )
  })
