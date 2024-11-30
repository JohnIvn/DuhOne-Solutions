import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database.js";
import { UserAccount } from "./signUpModel.js";

class UserProfileModel extends Model {}

UserProfileModel.init({
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserAccount,
      key: 'userId',
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  barangay: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zipCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize: db,
  modelName: 'UserProfileModel',
  tableName: 'userprofile',
  timestamps: false, 
});

export default UserProfileModel;
