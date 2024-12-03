import { subscription } from '../Models/subscriptionModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendSubscriptionReceipt } from '../Services/mailSender.js'; // Import the sendSubscriptionReceipt function

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const subscriptionController = async (req, res) => {
    try {
        const { userId, firstName, lastName, email } = req.user || {};
        const { plan } = req.body;

        console.log("Request Body: ", req.body);

        if (!userId || !plan) {
            return res.status(400).json({
                message: "Bad Request: Missing required fields (userId or plan).",
            });
        }

        const name = `${firstName} ${lastName}`;
        const existingSubscription = await subscription.findOne({ where: { userId } });

        let newSubscription;
        if (existingSubscription) {
            await existingSubscription.update({ plan });
            newSubscription = existingSubscription;
        } else {
            newSubscription = await subscription.create({
                userId,
                name,
                plan,
                paid: 'No',
                status: 'pending',
                subscribeAt: null,
                endAt: null,
            });
        }

        const [userProfile, isNewProfile] = await UserProfileModel.findOrCreate({
            where: { userId },
            defaults: {
                userId,
                firstName,
                lastName,
                email,
                plan,
            },
        });

        if (!isNewProfile) {
            await userProfile.update({ plan });
        }

        const receiptDir = path.join(__dirname, '../Receipts');
        if (!fs.existsSync(receiptDir)) {
            fs.mkdirSync(receiptDir);
        }

        const doc = new PDFDocument({ margin: 50 });
        const receiptFilePath = path.join(receiptDir, `receipt_${userId}.pdf`);
        doc.pipe(fs.createWriteStream(receiptFilePath));

        // Header of the receipt letter
        doc.fontSize(18).text("Your Subscription Receipt", { align: 'center' }).moveDown(2);
        
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' }).moveDown();
        
        doc.text("Dear " + name + ",", { align: 'left' }).moveDown();

        // Subscription Details Section
        doc.fontSize(12).text("Thank you for subscribing to our service. Below are the details of your subscription:", { align: 'left' }).moveDown();
        
        doc.fontSize(12).text(`Plan: ${plan}`, { align: 'left' }).moveDown();
        doc.text(`Subscription Status: ${newSubscription.status}`, { align: 'left' }).moveDown();
        doc.text(`Subscription Created At: ${new Date().toLocaleString()}`, { align: 'left' }).moveDown();

        // User Profile Details
        doc.fontSize(12).text("Your profile information:", { align: 'left' }).moveDown();
        doc.text(`Name: ${name}`, { align: 'left' }).moveDown();
        doc.text(`Email: ${email}`, { align: 'left' }).moveDown();
        doc.text(`Phone Number: ${userProfile.phoneNumber || 'N/A'}`, { align: 'left' }).moveDown();
        doc.text(`Street: ${userProfile.street || 'N/A'}`, { align: 'left' }).moveDown();
        doc.text(`City: ${userProfile.city || 'N/A'}`, { align: 'left' }).moveDown();
        doc.text(`Barangay: ${userProfile.barangay || 'N/A'}`, { align: 'left' }).moveDown();
        doc.text(`Zip Code: ${userProfile.zipCode || 'N/A'}`, { align: 'left' }).moveDown();

        // Footer of the receipt
        doc.moveDown();
        doc.fontSize(10).text("If you have any questions, feel free to contact our support team at support@yourcompany.com", { align: 'center' }).moveDown();
        
        doc.fontSize(10).text("Thank you for choosing our service!", { align: 'center' });

        doc.end();

        // Send the subscription receipt email
        await sendSubscriptionReceipt(email, receiptFilePath, userId);

        res.status(201).json({
            message: "Subscription created successfully! A receipt has been sent to your email.",
            subscription: newSubscription,
            receiptUrl: `/Receipts/receipt_${userId}.pdf`, 
        });

    } catch (error) {
        console.error("Error in subscription creation: ", error.message);
        return res.status(500).json({
            message: "Internal server error. Could not process subscription.",
            error: error.message,
        });
    }
};
