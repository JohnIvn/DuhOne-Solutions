import { Sequelize, DataTypes, Model } from 'sequelize';  
import db from '../database.js';  

class SignInModel extends Model {}

SignInModel.init(
  {

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,  
    modelName: 'SignInModel',
    tableName: 'useraccounts',  
    timestamps: false,  
  }
);

export default SignInModel;
