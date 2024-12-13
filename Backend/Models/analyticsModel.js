import { DataTypes, Model } from 'sequelize';
import db from '../database.js';
import dotenv from 'dotenv';

dotenv.config();

class AnalyticsModel extends Model {}

export const Analytics = AnalyticsModel.init(
  {
    totalRevenue: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    totalUsers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    totalAdmin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    totalDataTransfered: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    totalLogins: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
  },
  {
    sequelize: db,
    modelName: 'AnalyticsModel',
    tableName: 'analytics',  
    timestamps: true,  
  }
);

export default AnalyticsModel;
