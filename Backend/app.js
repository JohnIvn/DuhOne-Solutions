import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import signUpRouter from './Routes/signUpRoute.js';
import signInRouter from './Routes/signInRoute.js';
import homePageRouter from './Routes/homePageRoute.js';
import changePasswordRoute from './Routes/forgetPasswordRoute.js';
import reviewRouter from './Routes/reviewRoute.js';
import subscriptionRouter from './Routes/subscriptionRoute.js';
import dashboardRouter from './Routes/dashBoardRoute.js';
import userProfileRoute from './Routes/userProfileRoute.js'
import clientRouter from './Routes/clientsRoute.js';
import imageRoute from './Routes/imageRoute.js';
import getProfile from './Routes/imageRoute.js';
import gAuthService from './Services/gAuthService.js';
import {createTableUserProfile ,createTableUserAccounts, createTableAdminAccounts, createTableSubscriptions, createTableReview, createTableImageContainer } from './Services/tableCreate.js';
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
app.use('/userprofile', userProfileRoute);
app.use('/clients', clientRouter);
app.use('/review', reviewRouter);
app.use(changePasswordRoute); 
app.use('/upload-image', imageRoute);
app.use('/profile', getProfile);
app.use('/api/recaptcha', gAuthService);

async function initializeApp() {
  try {
    await createDatabaseIfNotExists();

    await db.authenticate();

    await createTableUserAccounts();
    await createTableAdminAccounts();
    await createTableSubscriptions();
    await createTableReview();
    await createTableUserProfile();
    await createTableImageContainer();
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
