import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 
import helmet from 'helmet';
import hpp from 'hpp';

import signUpRouter from './Routes/signUpRoute.js';
import signInRouter from './Routes/signInRoute.js';
import homePageRouter from './Routes/homePageRoute.js';
import changePasswordRoute from './Routes/forgetPasswordRoute.js';
import reviewRouter from './Routes/reviewRoute.js';
import subscriptionRouter from './Routes/subscriptionRoute.js';
import dashboardRouter from './Routes/dashBoardRoute.js';
import userProfileRoute from './Routes/userProfileRoute.js'
import clientRouter from './Routes/clientsRoute.js';
import gAuthService from './Services/gAuthService.js';
import {createTableUserProfile ,createTableUserAccounts, createTableAdminAccounts, createTableSubscriptions, createTableReview, createTableImageContainer, createTableBankAccount, createTableOnlinePaymentAccount, createTablePackage } from './Services/tableCreate.js';
import createDatabaseIfNotExists from './Services/databaseCreate.js';
import db from './database.js';
import verifyCodeRoute from './Routes/verifyCodeRoute.js';
import sendCodeRoute from './Routes/sendCodeRoute.js';
import { insertPackagesIfNotExist } from './Services/packageInserter.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(hpp());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('Public'));

app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);
app.use('/homepage', homePageRouter);
app.use('/subscription', subscriptionRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', userProfileRoute); 
app.use('/clients', clientRouter);
app.use('/review', reviewRouter);
app.use(changePasswordRoute); 
app.use('/api/recaptcha', gAuthService);
app.use('/send-code', sendCodeRoute);
app.use('/verify-code', verifyCodeRoute);


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
    await createTableBankAccount();
    await createTableOnlinePaymentAccount();
    await createTablePackage(); 
    await insertPackagesIfNotExist();

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
