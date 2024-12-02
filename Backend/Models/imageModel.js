import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database.js";
import { UserAccount } from "./signUpModel.js";

class UserImgModel extends Model {}

UserImgModel.init({
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserAccount, 
      key: 'userId',
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
  },
  imageData: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  }
}, {
  sequelize: db,
  modelName: 'UserImgModel',
  tableName: 'userimg', 
  timestamps: false, 
});

UserImgModel.belongsTo(UserAccount, { foreignKey: 'userId' });
UserAccount.hasOne(UserImgModel, { foreignKey: 'userId' });

export default UserImgModel;
