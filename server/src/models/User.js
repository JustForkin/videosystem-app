module.exports = (sequelize, DataTypes) =>
  sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true
    },
    password: DataTypes.STRING
  })
