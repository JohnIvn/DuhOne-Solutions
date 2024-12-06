import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js';

class BankAccountModel extends Model {}

export const BankAccount = BankAccountModel.init(
  {
    bankAccountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    routingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },    
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize: db,
    modelName: 'BankAccount',
    tableName: 'bank_accounts',
    timestamps: true,
  }
);
