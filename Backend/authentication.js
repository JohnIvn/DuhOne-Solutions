import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserAccount } from './Models/signUpModel.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed: Token not provided' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserAccount.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        next(); 
    } catch (error) {
        console.error('Token or database error:', error.message);
        return res.status(403).json({ message: 'Forbidden: Token is invalid or expired' });
    }
};

export default authenticateToken;
