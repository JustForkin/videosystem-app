const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8
  console.log('hashPassword: called')

  if (!user.changed('password')) {
    return
  }

  console.log('hashPassword: 1 stage called')
  console.log('hashPassword: user.password = ' + user.password)

  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true
    },
    password: DataTypes.STRING
  }, {
    hooks: {
      //beforeCreate: hashPassword,
      //beforeUpdate: hashPassword,
      beforeSave: hashPassword
    }
  })

  User.prototype.comparePassword = function (password) {
    console.log('comparePassword: inside the function')
    console.log('comparePassword: password = ' + password)
    console.log('comparePassword: this.password = ' + this.password)
    return bcrypt.compareAsync(password, this.password)
  }

  return User
}
