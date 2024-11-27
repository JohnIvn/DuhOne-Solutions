// tableCreate.js
import { UserAccount, AdminAccount } from '../Models/signUpModel.js';
import { subscription } from '../Models/subscriptionModel.js';

async function createTableUserAccounts() {
  try {
    await UserAccount.sync({ force: false });
    console.log('UserAccount table is created');
  } catch (error) {
    console.error('Error creating table', error);
  }
}

async function createTableAdminAccounts() {
  try {
    await AdminAccount.sync({ force: false });
    console.log('AdminAccount table created');
  } catch (error) {
    console.error('Error creating table', error);
  }
}

async function createTableSubscriptions() {
  try {
    await subscription.sync({ force: false });
    console.log('Subscriptions table is created');
  } catch (error) {
    console.error('Error creating table', error);
  }
}

export { createTableUserAccounts, createTableAdminAccounts, createTableSubscriptions}