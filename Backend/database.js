import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import createDatabaseIfNotExists from './Services/databaseCreate.js';

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,    
  process.env.DB_USER,     
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,  
    dialect: 'mysql',
    logging: false, 
  }
);

const setupDatabase = async () => {
  try {
    // await createDatabaseIfNotExists();
    // await db.authenticate(); 
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

setupDatabase();

export default db;
