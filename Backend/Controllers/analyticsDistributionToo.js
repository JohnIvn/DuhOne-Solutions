import { subscription } from '../Models/subscriptionModel.js';


export const getSubscriptionStatusDistribution = async (req, res) => {
  try {
    
    const statusCounts = await subscription.findAll({
      attributes: [
        'status', 
        [sequelize.fn('COUNT', sequelize.col('status')), 'count'], 
      ],
      group: ['status'], 
      raw: true, 
    });

    
    const statusDistribution = {
      active: 0,
      suspended: 0,
      pending: 0,
      inactive: 0,
    };

    statusCounts.forEach((item) => {
      switch (item.status) {
        case 'active':
          statusDistribution.active = parseInt(item.count);
          break;
        case 'suspended':
          statusDistribution.suspended = parseInt(item.count);
          break;
        case 'pending':
          statusDistribution.pending = parseInt(item.count);
          break;
        case 'inactive':
          statusDistribution.inactive = parseInt(item.count);
          break;
        default:
          break;
      }
    });

    res.json(statusDistribution);
  } catch (error) {
    console.error('Error fetching subscription status distribution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
