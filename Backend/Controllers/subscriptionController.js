import { subscription } from '../Models/subscriptionModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendSubscriptionReceipt } from '../Services/mailSender.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const subscriptionController = async (req, res) => {
    try {
        const { userId, firstName, lastName, email } = req.user || {};
        const { plan } = req.body;

        console.log('request user data: ', req.user);
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
                paid: 'False',
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

        // Header
        doc
            .fontSize(18)
            .font('Helvetica-Bold')
            .text("Subscription Receipt", { align: 'center' })
            .moveDown();
        doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Receipt Date: ${new Date().toLocaleDateString()}`, { align: 'right' });

        doc.moveDown(2);

        // Subscription Details Section
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Subscription Details", { align: 'left' })
            .moveDown();
        doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Name: ${name}`)
            .text(`Plan: ${plan}`)
            .text(`Subscription Status: ${newSubscription.status}`)
            .text(`Subscription Created At: ${new Date().toLocaleString()}`)
            .moveDown(2);

        // User Profile Information Section
        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Your Profile Information", { align: 'left' })
            .moveDown();
        doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Name: ${name}`)
            .text(`Email: ${email}`)
            .text(`Phone Number: ${userProfile.phoneNumber || 'N/A'}`)
            .text(`Street: ${userProfile.street || 'N/A'}`)
            .text(`City: ${userProfile.city || 'N/A'}`)
            .text(`Barangay: ${userProfile.barangay || 'N/A'}`)
            .text(`Zip Code: ${userProfile.zipCode || 'N/A'}`)
            .moveDown(2);

        // Footer
        doc
            .fontSize(10)
            .font('Helvetica')
            .text(
                "If you have any questions, feel free to contact our support team at support@yourcompany.com.",
                { align: 'center' }
            )
            .moveDown();
        doc.text("Thank you for choosing our service!", { align: 'center' });

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
