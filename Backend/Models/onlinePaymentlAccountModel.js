import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js';

class OnlinePaymentAccountModel extends Model {}

const OnlinePaymentAccount = OnlinePaymentAccountModel.init(
  {
    paypalAccountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paypalEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    modelName: 'PaypalAccount',
    tableName: 'paypal_accounts',
    timestamps: true,
  }
);

export default OnlinePaymentAccount;