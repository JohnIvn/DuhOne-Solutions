// tableCreate.js
import { UserAccount, AdminAccount } from '../Models/signUpModel.js';
import { subscription } from '../Models/subscriptionModel.js';
import { Review } from '../Models/reviewModel.js';
import TransactionModel from '../Models/TransactionModel.js';

async function createTableUserAccounts() {
  try {
    await UserAccount.sync({ alter: false });
    console.log('UserAccount table is checked and updated if necessary');
  } catch (error) {
    console.error('Error checking/updating UserAccount table', error);
  }
}

async function createTableTransactions(){
  try{
    await TransactionModel.sync({alter: false});
    console.log('transactions table is checked and updated if necessary');
  }catch(error){
    console.error('Error checking/updating transactions table', error);
  }
}

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

export { createTableUserAccounts, createTableAdminAccounts, createTableSubscriptions, createTableReview, createTableTransactions};