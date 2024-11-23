import { Sequelize, DataTypes, Model } from "sequelize";
import db from '../database.js'

class subscriptionModel extends Model {}

export const subscription = subscriptionModel.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        plan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subscribedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        endAT: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: db,
        modelName: "subscriptionModel",
        tableName: "subscriptions",
        timestamps: false,
        hooks: {
            beforeCreate: (subscription) => {
                subscription.endAT = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
            },
        },
    }
);
