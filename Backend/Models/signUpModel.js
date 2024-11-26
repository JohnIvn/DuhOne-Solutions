import db from '../database.js';
import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

class UserAccountModel extends Model {}

const UserAccount = UserAccountModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: process.env.DEFAULT_ROLE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize: db,
    modelName: 'UserAccount',
    tableName: 'useraccounts',
    timestamps: false,
  }
);
class AdminAccountModel extends Model {}

const AdminAccount = AdminAccountModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize: db,
    modelName: 'AdminAccount',
    tableName: 'adminaccounts',
    timestamps: false, 
  }
);

async function createTableUserAccounts() {
  try {
    await UserAccount.sync({ force: false }); 
    console.log('UserAccount table is synced and created if not exists');
  } catch (error) {
    console.error('Error syncing the table:', error);
  }
}

async function createTableAdminAccounts() {
  try {
    await AdminAccount.sync({ force: false }); 
    console.log('Adminaccounts table is synced and created if not exists');
  } catch (error) {
    console.error('Error syncing the table:', error);
  }
}

createTableUserAccounts();
createTableAdminAccounts();

export { UserAccount, AdminAccount };
