import { DataTypes, Model } from 'sequelize';
import { UserAccount } from '../Models/userAccountModel.js';  
import db from '../database.js';
import dotenv from 'dotenv';

dotenv.config();

class OffenseModel extends Model {}

export const Offense = OffenseModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserAccount, 
        key: 'userId',
      },
      allowNull: false,
    },
    offenseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
  },
  {
    sequelize: db,
    modelName: 'OffenseModel',
    tableName: 'offenses',  
    timestamps: true,  
  }
);

export default OffenseModel;
