import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js';
import { UserAccount } from '../Models/userAccountModel.js';
import UserProfileModel from './userProfileModel.js';

class ReviewModel extends Model {}

const Review = ReviewModel.init(
  {
    reviewId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdBy: {
      type: DataTypes.INTEGER, 
      references: {
        model: UserProfileModel,
        key: 'userId',
      },
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false, 
    },
    reviewContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true, 
  }
);


UserAccount.hasMany(Review, {
  foreignKey: {
    name: 'createdBy',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Review.belongsTo(UserAccount, {
  foreignKey: {
    name: 'createdBy',
    allowNull: false,
  },
});

export { Review };
