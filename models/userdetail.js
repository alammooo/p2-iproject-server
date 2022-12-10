"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User, { foreignKey: "UserId" })
    }
  }
  UserDetail.init(
    {
      fullName: DataTypes.STRING,
      gender: DataTypes.STRING,
      telephone: DataTypes.STRING,
      address: DataTypes.STRING,
      profilePict: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserDetail",
    }
  )
  return UserDetail
}
