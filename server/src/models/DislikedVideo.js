module.exports = (sequelize, DataTypes) => {
  const DislikedVideo = sequelize.define('DislikedVideo', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'username'
      }
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
      references: {
        model: 'Videos',
        key: 'id'
      }
    }
  }, {
    timestamps: false
  })

  return DislikedVideo
}
