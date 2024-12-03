// clientModel.js
import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js';

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
