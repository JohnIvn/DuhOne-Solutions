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

        const bankAccount = await BankAccount.findOne({ where: { BankAccountId: userId } });
        
        let bankName = null;  

        if (bankAccount) {
            bankName = bankAccount.bankName;  
        } else {
            console.log("No bank account found for the user.");
        }

        console.log(bankName);  // Log the bankName to ensure it's correct

        // Send the bankName along with the account data
        return res.json({
            ...account.toJSON(),  // Spread the account data (or convert to JSON if it's a Sequelize instance)
            bankName: bankName,  // Include the bankName in the response
        });
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

        const { 
            phoneNumber, 
            street, 
            city, 
            barangay, 
            zipCode, 
            firstName, 
            lastName, 
            paymentMethod, 
            plan 
        } = req.body;

        console.log("Received data:", req.body);

        // Fetch the user's account details
        const account = await UserProfileModel.findOne({ where: { userId } });
        if (!account) {
            return res.status(404).json({ error: "User profile not found" });
        }

        // Fetch the user's bank account details
        const bankAccount = await BankAccount.findOne({ where: { BankAccountId: userId } });
        if (!bankAccount) {
            return res.status(404).json({ error: "Bank account not found" });
        }

        // Check if the user has sufficient balance
        if (bankAccount.balance < plan.price) {
            return res.status(400).json({ error: "Insufficient balance to complete the transaction." });
        }

        console.log(plan.price);
        console.log(bankAccount.balance);

        // Deduct the plan price from the bank account balance
        bankAccount.balance -= plan.price;

        // Update user profile details
        await account.update({
            phoneNumber,
            street,
            city,
            barangay,
            zipCode,
            firstName,
            lastName,
            paymentMethod
        });

        // Update the bank account balance and payment method
        await bankAccount.update({
            balance: bankAccount.balance, // Save the updated balance
            bankName: paymentMethod
        });

        // Combine first and last names for the client
        const fullName = `${firstName} ${lastName}`;

        // Check if a client entry exists
        let client = await ClientModel.findOne({ where: { userId } });

        if (!client) {
            // Create a new client entry
            client = await ClientModel.create({
                userId,
                name: fullName, // Use combined first and last name
                plan: plan.plan,
                status: 'active',
                paid: 'True',
                subscribeAt: new Date(),
                endAt: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Set subscription end date to 1 month later
            });
        } else {
            // Update existing client entry
            await client.update({
                name: fullName, // Use combined first and last name
                plan: plan.plan,
                status: 'active',
                paid: 'True',
                // subscribeAt: new Date(),
                // endAt: new Date(new Date().getTime() + 3 * 60 * 1000) 
                subscribeAt: new Date(),
                endAt: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Extend subscription end date
            });
        }

        // Directory setup for receipts
        const receiptDir = path.join(__dirname, '../Receipts');
        if (!fs.existsSync(receiptDir)) {
            fs.mkdirSync(receiptDir);
        }

        // Generate receipt
        const doc = new PDFDocument({ margin: 50 });
        const receiptFilePath = path.join(receiptDir, `invoice_${userId}.pdf`);
        doc.pipe(fs.createWriteStream(receiptFilePath));

        const emailDisplay = account.email ? account.email : 'Email not provided';

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
            .text(`Name: ${fullName}`)
            .text(`Email: ${emailDisplay}`)
            .text(`Phone: ${phoneNumber}`)
            .text(`Street: ${street}`)
            .text(`City: ${city}`)
            .text(`Barangay: ${barangay}`)
            .text(`Zip Code: ${zipCode}`)
            .moveDown(2);

        doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text("Payment Details", { align: 'left' })
            .moveDown();

        doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Payment Method: ${paymentMethod}`)
            .text(`Package: ${plan.plan}`)
            .text(`Price: ₱ ${plan.price}`)
            .text(`Speed: ${plan.speed}`)
            .text(`Description: ${plan.description}`)
            .moveDown(2);

        doc
            .fontSize(10)
            .font('Helvetica')
            .text("If you have any questions, please contact support@duhonesolutions.com.", { align: 'center' })
            .moveDown();

        doc.text("Thank you for your payment!", { align: 'center' });

        doc.end();

        // Send receipt via email
        await sendSubscriptionReceipt(account.email, receiptFilePath, userId, fullName);

        return res.status(200).json({
            message: 'Subscription updated successfully. A receipt has been sent to your email.',
            receiptUrl: `/Receipts/invoice_${userId}.pdf`,
            remainingBalance: bankAccount.balance // Include remaining balance in the response
        });
    } catch (error) {
        console.error('Error updating subscription and processing payment:', error);
        return res.status(500).json({ message: 'An error occurred while updating subscription.', error });
    }
};
