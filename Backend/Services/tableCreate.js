// tableCreate.js
import { UserAccount, AdminAccount } from '../Models/signUpModel.js';

async function createTableUserAccounts() {
  try {
    await UserAccount.sync({ force: false });
    console.log('UserAccount table is created');
  } catch (error) {
    console.error('Error syncing the table:', error);
  }
}

async function createTableAdminAccounts() {
  try {
    await AdminAccount.sync({ force: false });
    console.log('AdminAccount table created');
  } catch (error) {
    console.error('Error syncing the table:', error);
  }
}

createTableUserAccounts();
createTableAdminAccounts();

export default { createTableUserAccounts, createTableAdminAccounts };
