import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import Sequelize from 'sequelize';
import { ClientModel } from '../Models/clientModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import { BankAccount } from '../Models/bankAccountModel.js';
import PackageModel from '../Models/packageModel.js';
import OffenseModel from '../Models/offenseModel.js';
import { sendSubscriptionReceipt } from '../Services/mailSender.js'; 
import { Op } from 'sequelize';
import { fileURLToPath } from 'url';
import schedule from 'node-schedule';

const scheduledJobs = new Map(); 

const scheduleClientEndTasks = (client) => {
  const endAt = new Date(client.endAt);
  const currentTime = new Date();

  if (scheduledJobs.has(client.userId)) {
    console.log(`Job already scheduled for client ${client.userId}`);
    return; 
  }

  if (endAt > currentTime) {
    schedule.scheduleJob(new Date(endAt), async () => {
      console.log(`Client ${client.userId}'s plan is ending at ${endAt}`);

      const previousEndAt = new Date(endAt);
      const newEndAt = new Date(endAt.getTime() + 3 * 60 * 1000); 

      try {
        await ClientModel.update(
          {
            endAt: newEndAt,
            subscribeAt: previousEndAt,
          },
          { where: { userId: client.userId } }
        );
        console.log(`Client ${client.userId}'s endAt updated to ${newEndAt}`);
      } catch (error) {
        console.error(`Error updating status for client ${client.userId}:`, error);
      }

      await deductPriceFromBalance(client);
      scheduledJobs.delete(client.userId);
    });

    scheduledJobs.set(client.userId, true);

    console.log(`Job scheduled for client ${client.userId} at ${endAt}`);
  } else {
    console.log(`Client ${client.userId}'s plan has already ended`);
  }
};

const deductPriceFromBalance = async (client) => {
  try {
    const packagePlan = await PackageModel.findOne({
      where: { plan: client.plan },
    });

    if (packagePlan) {
      const price = packagePlan.price;

      const bankAccount = await BankAccount.findOne({
        where: { bankAccountId: client.userId },
      });

      if (bankAccount) {
        const currentBalance = bankAccount.balance;
        let newBalance = currentBalance - price;

        if (newBalance < 0) {
          const offenseRecord = await OffenseModel.findOne({
            where: { userId: client.userId },
          });

          if (offenseRecord && offenseRecord.offenseCount >= 3) {
            await ClientModel.update(
              {
                paid: 'false',
                status: 'suspended',
              },
              { where: { userId: client.userId } }
            );

            console.log(`Client ${client.userId} has exceeded 3 offenses. Subscription suspended.`);
            return; 
          }

          console.log(`Client ${client.userId} has insufficient balance, but the loan will be allowed.`);

          await OffenseModel.update(
            { offenseCount: Sequelize.literal('offenseCount + 1') },
            { where: { userId: client.userId } }
          );

          console.log(`Offense count has been updated for client ${client.userId}`);
        }

        await BankAccount.update(
          { balance: newBalance },
          { where: { bankAccountId: client.userId } }
        );

        await sendReceipt(client);
        console.log(`Client ${client.userId}'s balance updated. Deducted ₱${price}. New balance: ₱${newBalance}`);
      } else {
        console.error(`Bank account not found for client ${client.userId}`);
      }
    } else {
      console.error(`Package plan not found for client ${client.userId} with plan: ${client.plan}`);
    }
  } catch (error) {
    console.error(`Error deducting price from balance for client ${client.userId}:`, error);
  }
};

const sendReceipt = async (client) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const receiptDir = path.join(__dirname, '../Receipts');
    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir);
    }

    const userProfile = await UserProfileModel.findOne({
      where: { userId: client.userId },
    });

    const bankAccount = await BankAccount.findOne({
      where: { bankAccountId: client.userId },
    });

    const packagePlan = await PackageModel.findOne({
      where: { plan: client.plan },
    });

    const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
    const emailDisplay = userProfile.email ? userProfile.email : 'Email not provided';
    const phoneNumber = userProfile.phoneNumber || 'Phone not provided';
    const street = userProfile.street || 'Street not provided';
    const city = userProfile.city || 'City not provided';
    const barangay = userProfile.barangay || 'Barangay not provided';
    const zipCode = userProfile.zipCode || 'Zipcode not provided';
    const paymentMethod = userProfile.paymentMethod || 'Payment method not provided';

    const doc = new PDFDocument({ margin: 50 });
    const receiptFilePath = path.join(receiptDir, `invoice_${client.userId}.pdf`);
    doc.pipe(fs.createWriteStream(receiptFilePath));

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
      .text(`Package: ${packagePlan.plan}`)
      .text(`Price: ₱ ${packagePlan.price}`)
      .text(`Speed: ${packagePlan.speed}`)
      .text(`Description: ${packagePlan.description}`)
      .moveDown(2);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text("If you have any questions, please contact support@duhonesolutions.com.", { align: 'center' })
      .moveDown();

    doc.text("Thank you for your payment!", { align: 'center' });

    doc.end();

    await sendSubscriptionReceipt(userProfile.email, receiptFilePath, client.userId, fullName);

    console.log(`Receipt for client ${client.userId} has been generated and emailed.`);
  } catch (error) {
    console.error(`Error generating or sending receipt for client ${client.userId}:`, error);
  }
};

const fetchActiveUsers = () => {
  schedule.scheduleJob('* * * * *', async () => {
    try {
      const activeClients = await ClientModel.findAll({
        attributes: ['userId', 'plan', 'status', 'endAt'],
        where: {
          status: 'active',
          plan: {
            [Op.ne]: 'n/a',
          },
        },
        include: [
          {
            model: UserProfileModel,
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber', 'street', 'city', 'barangay', 'zipCode', 'paymentMethod'],
            required: false,
          },
          {
            model: BankAccount,
            attributes: ['balance'],
            required: false, 
          },
          {
            model: PackageModel,
            attributes: ['plan', 'price'],
            required: true,
          },
        ],
      });

      console.log('Active Clients (Full Data): ', JSON.stringify(activeClients, null, 2));

      activeClients.forEach(client => {
        scheduleClientEndTasks(client);
      });
    } catch (error) {
      console.error('Error fetching active clients:', error);
    }
  });
};

fetchActiveUsers();
