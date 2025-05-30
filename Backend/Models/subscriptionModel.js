import { DataTypes, Model } from "sequelize";
import db from "../database.js";
import { UserAccount } from "./userAccountModel.js";

class subscriptionModel extends Model {}

const subscription = subscriptionModel.init(
  {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: UserAccount,
        key: "userId",
      },
    },
    name: {
      type: DataTypes.STRING,
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paid: {
      type: DataTypes.STRING,
      defaultValue: "No",
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    dataUsage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "subscriptionModel",
    tableName: "clients_subscription",
    timestamps: false,
  }
);

subscription.belongsTo(UserAccount, { foreignKey: "userId" });

export { subscription };
