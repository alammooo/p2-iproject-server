"use strict"
const { Model } = require("sequelize")
const { hashPassword } = require("../helpers/bcyrpt")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Favorite, { foreignKey: "UserId" })
      User.hasOne(models.UserDetail, { foreignKey: "UserId" })
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Email is required" },
          notNull: { msg: "Email is required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )

  User.beforeCreate((instance, options) => {
    instance.password = hashPassword(instance.password)
  })
  return User
}
