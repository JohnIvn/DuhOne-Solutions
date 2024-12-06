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
        const { plan, package_id, price } = req.body; 
        console.log(plan)

        console.log('Request user data: ', req.user);
        console.log("Request Body: ", req.body);

        if (!userId || !package_id) {
            return res.status(400).json({
                message: "Bad Request: Missing required fields (userId or package_id).",
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
            await userProfile.update({ package_id });
        }

        const receiptDir = path.join(__dirname, '../Receipts');
        if (!fs.existsSync(receiptDir)) {
            fs.mkdirSync(receiptDir);
        }

        const doc = new PDFDocument({ margin: 50 });
        const receiptFilePath = path.join(receiptDir, `invoice_${userId}.pdf`);
        doc.pipe(fs.createWriteStream(receiptFilePath));

        doc
            .fontSize(16)
            .font('Helvetica-Bold')
            .text("DuhOne Solutions", { align: 'center' })
            .fontSize(12)
            .font('Helvetica')
            .text("Subscription Invoice", { align: 'center' })
            .moveDown();

        doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Invoice Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
            .text(`Due Date: ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}`, { align: 'right' })
            .moveDown(2);

        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Billing Information", { align: 'left' })
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

        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Subscription Details", { align: 'left' })
            .moveDown();
    
        doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`Package ID: ${package_id}`, { continued: true })
            .text(`Plan: ${plan}`, { align: 'right' })
            .moveDown()
            .fontSize(12)
            .font('Helvetica')
            .text(`Subscription Status: ${newSubscription.status}`)
            .text(`Amount Due: ₱ ${price}`)
        .moveDown(2);
        doc
            .fontSize(10)
            .font('Helvetica')
            .text("If you have any questions, please contact support@duhonesolutions.com.", { align: 'center' })
            .moveDown();

        doc.text("Thank you for your business!", { align: 'center' });
        
        doc.end();

        await sendSubscriptionReceipt(email, receiptFilePath, userId, plan);

        res.status(201).json({
            message: "Invoice created successfully! A copy has been sent to your email.",
            subscription: newSubscription,
            receiptUrl: `/Receipts/invoice_${userId}.pdf`,
        });
    } catch (error) {
        console.error("Error in subscription creation: ", error.message);
        return res.status(500).json({
            message: "Internal server error. Could not process subscription.",
            error: error.message,
        });
    }
};
