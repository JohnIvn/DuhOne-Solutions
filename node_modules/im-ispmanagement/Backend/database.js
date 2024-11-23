import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();


const db = new Sequelize(
    process.env.DB_NAME,     
    process.env.DB_USER,     
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: console.log,
    }
  );

db.authenticate()
  .then(() => console.log('Database connection successful!'))
  .catch((error) => console.error('Unable to connect to the database.'));

export default db;
