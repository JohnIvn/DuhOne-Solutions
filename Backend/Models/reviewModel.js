import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../database.js';
import { UserAccount } from '../Models/signUpModel.js'; 

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
        model: UserAccount, 
        key: 'userId',
      },
      allowNull: false,
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE', 
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
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
