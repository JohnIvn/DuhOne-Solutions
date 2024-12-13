import schedule from 'node-schedule';
import Sequelize from 'sequelize';
import { Op } from 'sequelize';
import { ClientModel } from '../Models/clientModel.js';
import UserProfileModel from '../Models/userProfileModel.js';
import { BankAccount } from '../Models/bankAccountModel.js';
import PackageModel from '../Models/packageModel.js';

const scheduleClientEndTasks = (client) => {
  const endAt = new Date(client.endAt);
  const currentTime = new Date();

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
    });

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
        const newBalance = currentBalance - price;

        await BankAccount.update(
          { balance: newBalance },
          { where: { bankAccountId: client.userId } }
        );

        console.log(`Client ${client.userId}'s balance updated. Deducted $${price}. New balance: $${newBalance}`);
      } else {
        console.error(`Bank account not found for client ${client.userId} with bankAccountId: ${client.userId}`);
      }
    } else {
      console.error(`Package plan not found for client ${client.userId} with plan: ${client.plan}`);
    }
  } catch (error) {
    console.error(`Error deducting price from balance for client ${client.userId}:`, error);
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
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber', 'street', 'city', 'barangay', 'zipcode', 'paymentMethod'],
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
