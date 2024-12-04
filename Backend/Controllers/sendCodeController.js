import transporter from '../Services/mailSender.js';
import { verificationCodes } from '../Services/verificationCodes.js'; // Import verificationCodes

const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = Date.now() + 10 * 60 * 1000;
    verificationCodes[email] = { code: verificationCode, expires: expirationTime };

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    console.log(`Verification code sent to ${email}: ${verificationCode}`);

    try {
      await transporter.sendMail(mailOptions); 
      res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send verification code' });
    }
};

export default sendVerificationCode;
