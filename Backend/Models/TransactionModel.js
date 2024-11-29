import { Sequelize, DataTypes, Model } from "sequelize";
import db from '../database.js'

class TransactionModel extends Model {}

TransactionModel.init({
    transactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    submittedAt: {
        type: DataTypes.DATE,
    },
    validatedAt: {
        type: DataTypes.DATE
    }

}, {
    sequelize: db,
    modelName: 'TransactionModel',
    tableName: 'transactions'
});

export default TransactionModel;