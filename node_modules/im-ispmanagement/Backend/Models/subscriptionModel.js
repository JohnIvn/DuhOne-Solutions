import { Sequelize, DataTypes, Model } from "sequelize";
import db from '../database.js'

class subscriptionModel extends Model {}

   export const subscription = subscriptionModel.init({
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subscribedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    endAT: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'subscriptionModel',
    tableName: 'subscriptions',
    timestamps: false 
});
