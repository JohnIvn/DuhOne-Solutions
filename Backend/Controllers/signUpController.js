import db from '../database.js';
import bcrypt from 'bcrypt';
import { UserAccount, AdminAccount } from '../Models/signUpModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import UserImgModel from '../Models/imageModel.js';

const SignUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const existingAccount = await UserAccount.findOne({ where: { email } });

        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists!' });
        }

        const newUserAccount = await UserAccount.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const newAdminAccount = await AdminAccount.create({
            userId: newUserAccount.userId,
            email: newUserAccount.email,    
            password,     
        });

        const newUserImage = await UserImgModel.create({
            userId: newUserAccount.userId,
        });

        await UserProfileModel.create({
            userId: newUserAccount.userId,
            firstName: newUserAccount.firstName,
            lastName: newUserAccount.lastName,
            email: newUserAccount.email
        })

        return res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default SignUp;
