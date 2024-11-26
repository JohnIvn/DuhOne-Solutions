import db from '../database.js';
import bcrypt from 'bcrypt';
import { UserAccount, AdminAccount } from '../Models/signUpModel.js';

const SignUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const existingAccount = await UserAccount.findOne({ where: { email } });

        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists!' });
        }

        // Create the new UserAccount
        const newUserAccount = await UserAccount.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Now create the associated AdminAccount
        const newAdminAccount = await AdminAccount.create({
            userId: newUserAccount.userId, // Use the userId from UserAccount
            email: newUserAccount.email,    // Use the same email as the UserAccount (or assign a different one if needed)
            password,       // Store the unhashed password (again, not recommended, but per your original request)
        });

        return res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default SignUp;
