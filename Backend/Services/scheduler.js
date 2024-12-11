import schedule from 'node-schedule';
import { ClientModel } from '../Models/clientModel.js';

const fetchActiveUsers = () => {
  schedule.scheduleJob('* * * * *', async () => {
    console.log('Running scheduled task to fetch active users...');

    try {

      const activeUsers = await ClientModel.findAll({
        attributes: ['userId', 'endAt'],
        where: {
          status: 'active',
        },
      });

      if (activeUsers.length > 0) {
        console.log('Active Users:', activeUsers.map(user => user.toJSON()));
      } else {
        console.log('No active users found.');
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  });
};

fetchActiveUsers();
