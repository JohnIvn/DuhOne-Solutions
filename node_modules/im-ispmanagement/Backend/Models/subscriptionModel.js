import { Sequelize, DataTypes, Model } from "sequelize";
import db from '../database.js'

class subscriptionModel extends Model {}

export const subscription = subscriptionModel.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        plan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
        subscribeAt: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        endAT: {
            type: DataTypes.DATE,
            defaultValue: null
        },
    },
    
    {
        sequelize: db,
        modelName: "subscriptionModel",
        tableName: "clients_subscription",
        timestamps: false,
        hooks: {
            beforeCreate: (subscription) => {
                subscription.endAT = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
            },
        },
    }
);
