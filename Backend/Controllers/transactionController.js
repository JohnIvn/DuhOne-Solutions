import UserProfileModel from "../Models/userProfileModel.js";
import { BankAccount } from "../Models/bankAccountModel.js";
import { ClientModel } from "../Models/clientModel.js";
import schedule from 'node-schedule';
import path from "path";
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { sendSubscriptionReceipt } from '../Services/mailSender.js'; 

export const subscriptionTransactionGetCredentials = async (req, res) => {
    try {
        const { userId } = req.user;
        const account = await UserProfileModel.findOne({ where: { userId } });

        if (!account) {
            return res.status(404).json({ error: "User profile not found" });
        }

        return res.json(account);
    } catch (error) {
        console.error("Error fetching user credentials:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



export const updateSubscriptionAndPayment = async (req, res) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const { userId } = req.user;
        
        // Get the data from req.body
        const { 
            phoneNumber, 
            street, 
            city, 
            barangay, 
            zipCode, 
            name, 
            paymentMethod, 
            price,
            plan // If plan is included in req.body
        } = req.body;

        console.log("Received data:", req.body); // To log all the incoming data

        // Fetch and update user profile
        const account = await UserProfileModel.findOne({ where: { userId } });

        if (!account) {
            return res.status(404).json({ error: "User profile not found" });
        }

        // Update user profile with new information
        await account.update({
            phoneNumber,
            street,
            city,
            barangay,
            zipCode,
            name,
            paymentMethod,
        });

        // Update payment method in bank account
        await BankAccount.update(
            {
                bankName: paymentMethod,
            },
            {
                where: { BankAccountId: userId },
            }
        );

        // Generate receipt PDF
        const receiptDir = path.join(__dirname, '../Receipts');
        if (!fs.existsSync(receiptDir)) {
            fs.mkdirSync(receiptDir);
        }

        const doc = new PDFDocument({ margin: 50 });
        const receiptFilePath = path.join(receiptDir, `invoice_${userId}.pdf`);
        doc.pipe(fs.createWriteStream(receiptFilePath));

        // Fetch user profile again for detailed information
        const userProfile = await UserProfileModel.findOne({ where: { userId } });
        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" });
        }

        const fullName = `${userProfile.firstName || 'N/A'} ${userProfile.lastName || 'N/A'}`;
        const emailDisplay = userProfile.email ? userProfile.email : 'Email not provided';

// Update PDF generation logic to include all the req.body data
            doc
            .fontSize(16)
            .font('Helvetica-Bold')
            .text("DuhOne Solutions", { align: 'center' })
            .fontSize(12)
            .font('Helvetica')
            .text("Payment Receipt", { align: 'center' })
            .moveDown();

            doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Invoice Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
            .moveDown(2);

            doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Billing Information", { align: 'left' })
            .moveDown();

            doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Name: ${req.body.firstName} ${req.body.lastName}`)
            .text(`Email: ${req.body.email}`)
            .text(`Phone: ${req.body.phoneNumber}`)
            .text(`Street: ${req.body.street}`)
            .text(`City: ${req.body.city}`)
            .text(`Barangay: ${req.body.barangay}`)
            .text(`Zip Code: ${req.body.zipCode}`)
            .moveDown(2);

            doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Payment Details", { align: 'left' })
            .moveDown();

            doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Payment Method: ${req.body.paymentMethod}`)
            .text(`Package: ${req.body.plan.plan}`)
            .text(`Price: ₱ ${req.body.plan.price}`)
            .text(`Speed: ${req.body.plan.speed}`)
            .text(`Description: ${req.body.plan.description}`)
            .moveDown(2);

            doc
            .fontSize(10)
            .font('Helvetica')
            .text("If you have any questions, please contact support@duhonesolutions.com.", { align: 'center' })
            .moveDown();

            doc.text("Thank you for your payment!", { align: 'center' });

            doc.end();


        // Send receipt via email
        await sendSubscriptionReceipt(userProfile.email, receiptFilePath, userId, name);

        return res.status(200).json({
            message: 'Subscription updated successfully. A receipt has been sent to your email.',
            receiptUrl: `/Receipts/invoice_${userId}.pdf`
        });
    } catch (error) {
        console.error('Error updating subscription and processing payment:', error);
        return res.status(500).json({ message: 'An error occurred while updating subscription.', error });
    }
};
