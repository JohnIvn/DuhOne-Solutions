import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js'

class UserProfileModel extends Model {}

UserProfileModel.init({
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: process.env.DEFAULT_ROLE
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
    }, {
    sequelize: db,
    modelName: "UserProfile",
    tableName: "useraccounts",
    timestamps: false
});


export default UserProfileModel;