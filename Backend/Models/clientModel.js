// clientModel.js
import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js';
import UserProfileModel from './userProfileModel.js';
import BankAccount from './bankAccountModel.js';
import PackageModel from './packageModel.js';

class Client extends Model {}

export const ClientModel = Client.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    paid: {
      type: DataTypes.STRING,
      defaultValue: "False"
    },
    subscribeAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    endAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    modelName: 'Client',
    tableName: 'clients_subscription', 
    timestamps: false,
    hooks: {
      beforeCreate: (client) => {
        client.plan = client.plan.trim().toLowerCase();  
      },
    },
  }
);

ClientModel.hasOne(UserProfileModel, { foreignKey: 'userId' });
UserProfileModel.belongsTo(ClientModel, { foreignKey: 'userId' });

ClientModel.hasOne(BankAccount, { foreignKey: 'bankAccountId'});
BankAccount.belongsTo(ClientModel, { foreignKey: 'bankAccountId' });

ClientModel.belongsTo(PackageModel, { foreignKey: 'plan', targetKey: 'plan' });
PackageModel.hasMany(ClientModel, { foreignKey: 'plan', sourceKey: 'plan' });
