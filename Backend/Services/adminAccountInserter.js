import bcrypt from 'bcrypt';
import { AdminAccount, UserAccount } from '../Models/userAccountModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import AnalyticsModel from '../Models/analyticsModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const insertAdminAccountIfNotExist = async () => {
    try {
        const existingPackages = await UserAccount.findAll();

        if (existingPackages.length === 0) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

            const accounts = [
                { userId: '1', email: process.env.ADMIN_EMAIL, role: process.env.ADMIN_ROLE, password: hashedPassword }
            ];

            const profile = [
                { userId: '1', email: process.env.ADMIN_EMAIL, firstName: 'duhone', lastName: "numbawan" }
            ];

            await UserAccount.bulkCreate(accounts);
            await UserProfileModel.bulkCreate(profile);
            console.log('Admin account inserted successfully in UserAccount');
        } else {
            console.log('Admin account already exists in UserAccount, skipping insertion');
        }

        const existingAdminPackages = await AdminAccount.findAll();

        if (existingAdminPackages.length === 0) {

            const accounts = [
                { userId: '1', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
            ];

            await AdminAccount.bulkCreate(accounts);

            const analyticsRecord = await AnalyticsModel.findOne();
            if (analyticsRecord) {
                await analyticsRecord.increment('totalAdmin', { by: 1 });
            } else {
                await AnalyticsModel.create({ totalAdmin: 1 }); 
            }

            console.log('Admin account inserted successfully in AdminAccount');
        } else {
            console.log('Admin account already exists in AdminAccount, skipping insertion');
        }
    } catch (error) {
        console.error('Error inserting accounts:', error);
    }
};