import nodemailer from 'nodemailer';
import path from 'path';

// Set up the email transporter with your SMTP service configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Use Gmail or your preferred email service
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
});

// Create a function to send an email with the attachment
export const sendSubscriptionReceipt = (recipientEmail, receiptFilePath, userId) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: recipientEmail, // Use recipientEmail from the request body
        subject: 'Subscription Receipt', // Subject line
        text: 'Please find your subscription receipt attached.', // Email body
        attachments: [
            {
                filename: `receipt_${userId}.pdf`,
                path: receiptFilePath, // Path to the generated PDF file
                contentType: 'application/pdf',
            },
        ],
    };

    // Send the email with the PDF attachment
    return transporter.sendMail(mailOptions);
};
