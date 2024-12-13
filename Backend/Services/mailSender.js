import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
});

export const sendSubscriptionReceipt = (recipientEmail, receiptFilePath, userId) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: recipientEmail, 
        subject: 'Subscription Receipt', 
        text: 'Please find your subscription receipt attached.', 
        attachments: [
            {
                filename: `receipt_${userId}.pdf`,
                path: receiptFilePath, 
                contentType: 'application/pdf',
            },
        ],
    };
    return transporter.sendMail(mailOptions);
};

export default transporter