import { ClientModel } from '../Models/clientModel.js'; 
import UserProfileModel from '../Models/userProfileModel.js';
import { Op } from 'sequelize';  // Import Op from Sequelize for operators

export const getClients = async (req, res) => {
  try {
    const { plan, status, paid } = req.query;

    const normalizedPlan = plan ? plan.trim().toLowerCase() : undefined;
    const normalizedStatus = status ? status.trim().toLowerCase() : undefined;
    const normalizedPaid = paid ? paid.trim().toLowerCase() : undefined;

    const filter = {};

    // Add filters based on the query parameters
    if (normalizedPlan) filter.plan = normalizedPlan;
    if (normalizedPaid) filter.paid = normalizedPaid;

    // If status is provided, exclude 'suspended' status
    if (normalizedStatus) {
      if (normalizedStatus === 'suspended') {
        // Exclude suspended clients using Op.ne
        filter.status = { [Op.ne]: 'Suspended' };  // Make sure the status is case-sensitive in DB
      } else {
        filter.status = normalizedStatus;  // Add other statuses if given
      }
    } else {
      // Exclude suspended status by default if no status is passed
      filter.status = { [Op.ne]: 'Suspended' };
    }

    // Fetch clients based on the filter
    const clients = await ClientModel.findAll({ where: filter });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients' });
  }
};


export const updateClientStatus = async (req, res) => { 
  try {
    const { id } = req.params;
    const { status } = req.body;

    const normalizedStatus = status ? status.trim().toLowerCase() : undefined;

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const client = await ClientModel.findOne({ where: { userId: id } });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    let updateData = { status: normalizedStatus };

    if (normalizedStatus === 'approved') {
      const subscribeAt = new Date();  
      const endAt = new Date();
      endAt.setDate(subscribeAt.getDate() + 30);  

      updateData = {
        ...updateData,
        subscribeAt,
        endAt,
      };
    }

    const [updated] = await ClientModel.update(updateData, { where: { userId: id } });

    if (!updated) {
      return res.status(404).json({ message: 'Client not found or no changes made' });
    }

    res.json({ message: 'Client status and dates updated successfully' });
  } catch (error) {
    console.error('Error updating client status:', error);
    res.status(500).json({ message: 'Error updating client status' });
  }
};

export const searchByID = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const find = await UserProfileModel.findOne({
      where: { userId },
    });

    if (!find) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(find);
  } catch (error) {
    console.error('Error searching by ID:', error);
    res.status(500).json({ message: 'Error searching by ID' });
  }
};


export const getAllSuspended = async (req, res) => {
  try {
    // Fetch all clients with the status 'Suspended'
    const suspendedClients = await ClientModel.findAll({
      where: { status: 'Suspended' },  // Using Sequelize syntax to filter by status
    });

    // If no clients are found, return a message
    if (suspendedClients.length === 0) {
      return res.json({ message: 'No suspended clients found.' });
    }

    // Respond with the list of suspended clients
    res.status(200).json(suspendedClients);
  } catch (error) {
    console.error('Error fetching suspended clients:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
