import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import signUpRouter from './Routes/signUpRoute.js';
import signInRouter from './Routes/signInRoute.js';
import homePageRouter from './Routes/homePageRoute.js';
import subscriptionRouter from './Routes/subscriptionRoute.js';
import dashboardRouter from './Routes/dashBoardRoute.js';
import userSettingsRouter from './Routes/userSettingsRoute.js';
import clientRouter from './Routes/clientsRoute.js';
import { createTableUserAccounts, createTableAdminAccounts, createTableSubscriptions } from './Services/tableCreate.js';
import createDatabaseIfNotExists from './Services/databaseCreate.js';
import db from './database.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('Public'));

app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);
app.use('/homepage', homePageRouter);
app.use('/subscription', subscriptionRouter);
app.use('/dashboard', dashboardRouter);
app.use('/settings', userSettingsRouter);
app.use('/clients', clientRouter);

async function initializeApp() {
  try {
    await createDatabaseIfNotExists();

    await db.authenticate();

    await createTableUserAccounts();
    await createTableAdminAccounts();
    await createTableSubscriptions();
    console.log('Tables have been created or checked.');

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error initializing the application:', error);
    process.exit(1);
  }
}

initializeApp();
