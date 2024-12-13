import transporter from '../Services/mailSender.js';
import { verificationCodes } from '../Services/verificationCodes.js'; 

const COOLDOWN_PERIOD = 30 * 1000; 

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const lastSentTime = verificationCodes[email]?.lastSentTime;
  if (lastSentTime && Date.now() - lastSentTime < COOLDOWN_PERIOD) {
    const remainingTime = Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastSentTime)) / 1000);
    return res.status(400).json({ message: `Please wait ${remainingTime} seconds before requesting a new code` });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const expirationTime = Date.now() + 10 * 60 * 1000; 

  verificationCodes[email] = { 
    code: verificationCode, 
    expires: expirationTime,
    lastSentTime: Date.now(), 
  };

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
