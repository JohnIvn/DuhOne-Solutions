import { DataTypes, Model } from "sequelize";
import UserProfileModel from "./userProfileModel.js";
import db from "../database.js";

class RequestFormModel extends Model {}

RequestFormModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: UserProfileModel,
          key: 'userId',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
    plan: {
        type: DataTypes.STRING
    },
    paymentMethod: {
        type: DataTypes.STRING
    },
    requestStatus: {
        type: DataTypes.STRING
    }
}, {
    sequelize: db,
    modelName: "Request Form Model",
    tableName: "requestTable",
    timestamps: true
});

export default RequestFormModel;
