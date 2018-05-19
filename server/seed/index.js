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
    await sequelize.query(
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
    await sequelize.query(
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
    await sequelize.query(
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
    await sequelize.query(
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

    await sequelize.query(
      'CREATE OR REPLACE FUNCTION "user_popularity"("username_" character varying(255)) \n' +
      'RETURNS DOUBLE PRECISION ' +
      'AS $$ ' +

      'DECLARE ' +
        '"n" INT := 0; ' +
        '"lc" NUMERIC := 0; ' +
        '"avg_vr" NUMERIC := 0; ' +

      'BEGIN ' +
        'IF EXISTS (SELECT "username" FROM "Users" WHERE "username" = "username_") THEN ' +
        'BEGIN ' +
          'SELECT COUNT("id") INTO "n" ' +
          'FROM "Videos" ' +
          'WHERE "authorUsername" = "username_"; ' +

          'IF "n" = 0 THEN RETURN 0; END IF; ' +

          '"lc" := (1 + "n") / 2.0; ' +

          'SELECT AVG("likes" - "dislikes") INTO "avg_vr" ' +
          'FROM "Videos" ' +
          'WHERE "authorUsername" = "username_"; ' +

          'RETURN ("lc" + "avg_vr") / 2.0; ' +

        'END; ' +
        'ELSE RAISE EXCEPTION \'User does not exist.\'; ' +
        'END IF; ' +
      'END; ' +
      '$$ ' +
      'LANGUAGE PLPGSQL; ')

    await sequelize.query(
      'CREATE OR REPLACE FUNCTION "user_popularity_search"("searchQuery" character varying(255)) \n' +
      'RETURNS TABLE ( ' +
      	'"username" "Users"."username"%TYPE, ' +
      	'"popularity" DOUBLE PRECISION, ' +
      	'"firstname" "Users"."firstname"%TYPE, ' +
      	'"lastname" "Users"."lastname"%TYPE, ' +
      	'"birthday" "Users"."birthday"%TYPE, ' +
      	'"gender" "Users"."gender"%TYPE, ' +
      	'"about" "Users"."about"%TYPE, ' +
      	'"registerDate" "Users"."registerDate"%TYPE, ' +
      	'"isAdmin" "Users"."isAdmin"%TYPE ' +
      ') ' +
      'AS $$ ' +
      'BEGIN ' +
        'RETURN QUERY ' +
        'SELECT ' +
      	'"Users"."username", ' +
      	'"user_popularity"("Users"."username"), ' +
      	'"Users"."firstname", ' +
      	'"Users"."lastname", ' +
      	'"Users"."birthday", ' +
      	'"Users"."gender", ' +
      	'"Users"."about", ' +
      	'"Users"."registerDate", ' +
      	'"Users"."isAdmin" ' +
        'FROM "Users" ' +
        'WHERE "Users"."username" ILIKE "searchQuery" ' +
        'ORDER BY 2 DESC; ' +
      'END; ' +
      '$$ ' +
      'LANGUAGE PLPGSQL; '
    )
  })
