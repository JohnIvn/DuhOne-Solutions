// tableCreate.js
import { UserAccount, AdminAccount } from '../Models/userAccountModel.js';
import { subscription } from '../Models/subscriptionModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import { Review } from '../Models/reviewModel.js';
import UserImgModel from '../Models/imageModel.js';
import BankAccount from '../Models/bankAccountModel.js';
import OnlinePaymentAccount from '../Models/onlinePaymentlAccountModel.js'

async function createTableUserAccounts() {
  try {
    await UserAccount.sync({ alter: false });
    console.log('UserAccount table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating UserAccount table', error);
  }
}

async function createTableUserProfile(){
  try{
    await UserProfileModel.sync({alert: false});
    console.log('User Profile table is checked and updated if necessary');
  }catch(error){
    console.error('Error checking/Updating UserProfile tabke ', error);
  }
};

async function createTableAdminAccounts() {
  try {
    await AdminAccount.sync({ alter: false });
    console.log('AdminAccount table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating AdminAccount table', error);
  }
}

async function createTableSubscriptions() {
  try {
    await subscription.sync({ alter: false });
    console.log('Subscriptions table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating Subscriptions table', error);
  }
}


async function createTableReview() {
  try {
    await Review.sync({ alter: false });
    console.log('Review table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating Review table', error);
  }
}

async function createTableImageContainer() {
  try {
    await BankAccount.sync({ alter: false });
    console.log('Image table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating Image table', error);
  }
}

async function createTableBankAccount() {
  try {
    await UserImgModel.sync({ alter: false });
    console.log('Bank table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating Image table', error);
  }
}

async function createTableOnlinePaymentAccount() {
  try {
    await OnlinePaymentAccount.sync({ alter: false });
    console.log('Online Payment table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating Image table', error);
  }
}

export { createTableUserAccounts, createTableAdminAccounts, createTableSubscriptions, createTableReview, createTableUserProfile, createTableImageContainer, createTableBankAccount, createTableOnlinePaymentAccount }