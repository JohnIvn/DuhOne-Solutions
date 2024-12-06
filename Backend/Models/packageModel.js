import { Sequelize, DataTypes, Model } from "sequelize";
import UserProfileModel from "./userProfileModel.js";
import db from "../database.js";

class PackageModel extends Model {}

PackageModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: UserAccount, 
          key: 'userId', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      plan: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.FLOAT
      }
}, {
    sequelize: db,
    modelName: "PackageModel",
    tableName: "PackageTable"
});

export default PackageModel;