const {User, Video} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  async users (req, res) {
    try {
      let users = null
      const search = req.query.search
      const sortBy = req.query.sortBy

      const attributesToShow = ["username", "firstname", "lastname",
        "birthday", "gender", "about", "registerDate", "isAdmin"]

      var orderBy = [
        ['registerDate', 'DESC']
      ]

      // if (sortBy) {
      //   orderBy = [
      //     ['views', 'DESC']
      //   ]
      // }

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
  }
}
