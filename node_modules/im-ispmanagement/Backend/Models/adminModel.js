import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database.js";


class adminModel extends Model {}

adminModel.init({
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
},
{
    sequelize: db,
    modelName: 'Admin',
    tableName: 'adminaccounts', 
    timestamps: false,
  });

export default adminModel;