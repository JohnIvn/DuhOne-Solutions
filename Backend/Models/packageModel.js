import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database.js";

class PackageModel extends Model {}

PackageModel.init({
    Package_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    plan: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT
    },
    speed: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
}, {
    sequelize: db,
    modelName: "PackageModel",
    tableName: "PackageTable"
});

export default PackageModel;