import { subscription } from '../Models/subscriptionModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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

        if (existingSubscription) {
            await existingSubscription.update({ plan });

            return res.status(200).json({
                message: "Subscription updated successfully!",
                subscription: existingSubscription,
            });
        }

        const newSubscription = await subscription.create({
            userId,
            name,
            plan,
            paid: 'No',
            status: 'pending',
            subscribeAt: null,
            endAt: null,
        });

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

        // Generate PDF for the subscription
        const doc = new PDFDocument();
        const receiptsFolderPath = path.join(__dirname, '../Receipts');  // Save to receipts folder
        if (!fs.existsSync(receiptsFolderPath)) {
            fs.mkdirSync(receiptsFolderPath);  // Create receipts folder if it doesn't exist
        }

        const pdfPath = path.join(receiptsFolderPath, `${userId}_subscription.pdf`);

        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        // Add content to PDF
        doc.fontSize(18).text('Subscription Details', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${name}`);
        doc.text(`Email: ${email}`);
        doc.text(`Plan: ${plan}`);
        doc.text(`Status: ${newSubscription.status}`);
        doc.text(`Paid: ${newSubscription.paid}`);
        doc.text(`Subscription Created At: ${new Date().toISOString()}`);

        // Wait for the finish event before responding
        writeStream.on('finish', () => {
            return res.status(201).json({
                message: "Subscription created successfully!",
                subscription: newSubscription,
                pdfPath: pdfPath, // Optionally send back the path to the generated PDF
            });
        });

        doc.end(); // Close the document to trigger the finish event

    } catch (error) {
        console.error("Error in subscription creation: ", error.message);
        return res.status(500).json({
            message: "Internal server error. Could not process subscription.",
            error: error.message,
        });
    }
};
