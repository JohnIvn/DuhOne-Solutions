import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { SignInModel } from '../Models/userAccountModel.js';
import AnalyticsModel from '../Models/analyticsModel.js';

dotenv.config();

const SignIn = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await SignInModel.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: 'User not Found' });
      }
  
      const verified = await bcrypt.compare(password, user.password);
  
      if (!verified) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      const token = jwt.sign(
        { email: user.email, userId: user.userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const analyticsRecord = await AnalyticsModel.findOne();
      if (analyticsRecord) {
          await analyticsRecord.increment('totalLogins', { by: 1 });
      } else {
          await AnalyticsModel.create({ totalLogins: 1 }); 
      }

      return res.status(200).json({
        message: 'Login successful.',
        token: token,
        role: user.role,  
        redirectTo: user.role === 'Admin' ? '/Admin-Portal' : '/homepage',  
      });
  
    } catch (error) {
      console.error("Error in SignIn function: ", error);
      res.status(500).json({ message: 'An error occurred during login.' });
    }
  };
  

export default SignIn;
