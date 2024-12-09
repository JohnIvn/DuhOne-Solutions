import bcrypt from 'bcrypt';
import { AdminAccount, UserAccount } from '../Models/userAccountModel.js';
import UserProfileModel from '../Models/userProfileModel.js';

export const insertAdminAccountIfNotExist = async () => {
    try {
        const existingPackages = await UserAccount.findAll();

        if (existingPackages.length === 0) {
            const hashedPassword = await bcrypt.hash('11111111', 10);

            const accounts = [
                { userId: '1', email: 'duhonesolutions@gmail.com', role: 'Admin', password: hashedPassword }
            ];

            const profile = [
                { userId: '1', email: 'duhonesolutions@gmail.com', firstName: 'duhone', lastName: "numbawan"}
            ]

            await UserAccount.bulkCreate(accounts);
            await UserProfileModel.bulkCreate(profile);
            console.log('Admin account inserted successfully in UserAccount');
        } else {
            console.log('Admin account already exists in UserAccount, skipping insertion');
        }

        const existingAdminPackages = await AdminAccount.findAll();

        if (existingAdminPackages.length === 0) {

            const accounts = [
                { userId: '1', email: 'duhonesolutions@gmail.com', password: '11111111' }
            ];

            await AdminAccount.bulkCreate(accounts);
            console.log('Admin account inserted successfully in AdminAccount');
        } else {
            console.log('Admin account already exists in AdminAccount, skipping insertion');
        }
    } catch (error) {
        console.error('Error inserting accounts:', error);
    }
};
