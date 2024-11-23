import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import SignInModel from '../Models/signInModel.js';

dotenv.config();

const SignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in both email and password.' });
        }
        const user = await SignInModel.findOne({
            where: { email }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const verified = await bcrypt.compare(password, user.password);

        if (!verified) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign(
            {email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return res.status(200).json({
            message: 'Login successful.',
            token: token,
        });

    } catch (error) {
        console.log(error);
    }
};

export default SignIn;
