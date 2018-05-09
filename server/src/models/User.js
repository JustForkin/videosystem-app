const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8

  if (!user.changed('password')) {
    return
  }

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
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING
    },
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true // false = NOT NULL by default
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['Male', 'Female']]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registerDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      //beforeCreate: hashPassword,
      //beforeUpdate: hashPassword,
      beforeSave: hashPassword
    },
    timestamps: false
  })

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password)
  }

  // Built-in admins
  User.create({
  	username: "admin0",
  	password: "12345678",
  	firstname: "Senior",
  	lastname: "Crypt",
  	birthday: "1995-02-01",
  	gender: "Male",
  	about: "Admin Zero",
    isAdmin: true
  })
  User.create({
  	username: "admin1",
  	password: "12345678",
  	firstname: "Uno",
  	lastname: "Smither",
  	birthday: "1992-11-22",
  	gender: "Female",
  	about: "Admin One",
    isAdmin: true
  })
  User.create({
  	username: "admin2",
  	password: "12345678",
  	firstname: "Smith",
  	lastname: "Legacy",
  	birthday: "1991-03-20",
  	gender: "Male",
  	about: "Admin Two",
    isAdmin: true
  })

  return User
}
