import { subscription } from '../Models/subscriptionModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

        // doc.image('path/to/logo.png', { width: 100, align: 'center' }); 
        // doc.moveDown();
        
        doc.fontSize(20).text("Subscription Receipt", { align: 'center', underline: true });
        
        doc.rect(50, 150, 500, 250).stroke();

        doc.fontSize(14).text("Name: ", 60, 170, { continued: true }).font('Helvetica-Bold').text(name);
        doc.moveDown();
        doc.fontSize(14).text("Email: ", 60, 200, { continued: true }).font('Helvetica-Bold').text(email);
        doc.moveDown();
        doc.fontSize(14).text("Plan: ", 60, 230, { continued: true }).font('Helvetica-Bold').text(plan);
        doc.moveDown();
        doc.fontSize(14).text("Subscription Status: ", 60, 260, { continued: true }).font('Helvetica-Bold').text(newSubscription.status);
        doc.moveDown();
        doc.fontSize(14).text("Subscription Created At: ", 60, 290, { continued: true }).font('Helvetica-Bold').text(new Date().toLocaleString());

        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Oblique').text("Thank you for subscribing to our service!", { align: 'center' });

        doc.moveDown();
        doc.fontSize(10).text("For support, contact us at: support@yourcompany.com", { align: 'center' });
        
        doc.end();

        res.status(201).json({
            message: "Subscription created successfully!",
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
