import bcrypt from 'bcrypt';
import { UserAccount, AdminAccount } from '../Models/userAccountModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import UserImgModel from '../Models/imageModel.js';
import { BankAccount } from '../Models/bankAccountModel.js';

const SignUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const existingAccount = await UserAccount.findOne({ where: { email } });

        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists!', exists: true});
        }

        const newUserAccount = await UserAccount.create({
            email,
            password: hashedPassword,
        });

        await AdminAccount.create({
            userId: newUserAccount.userId,
            email: newUserAccount.email,    
            password,     
        });

        await UserImgModel.create({
            userId: newUserAccount.userId,
        });

        await UserProfileModel.create({

            userId: newUserAccount.userId,
            firstName,
            lastName,
            email: newUserAccount.email

        });

        const AccountNumber = `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const RoutingNumber = `RTN${Math.floor(100000 + Math.random() * 900000)}`;
        const Balance = parseFloat((5000 + Math.random() * 10000).toFixed(2));

        await BankAccount.create({
            bankAccountId: newUserAccount.userId,
            accountNumber: AccountNumber, 
            routingNumber: RoutingNumber,
            balance: Balance
        });

        return res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default SignUp;
