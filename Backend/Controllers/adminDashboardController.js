import { ClientModel } from '../Models/clientModel.js'; 
import UserProfileModel from '../Models/userProfileModel.js';
import AnalyticsModel from '../Models/analyticsModel.js';
import { Op } from 'sequelize';  
import configureSockets from '../server.js';

export const getClients = async (req, res) => {
  try {
    const { plan, status, paid } = req.query;

    const normalizedPlan = plan ? plan.trim().toLowerCase() : undefined;
    const normalizedStatus = status ? status.trim().toLowerCase() : undefined;
    const normalizedPaid = paid ? paid.trim().toLowerCase() : undefined;

    const filter = {};
    if (normalizedPlan) filter.plan = normalizedPlan;
    if (normalizedPaid) filter.paid = normalizedPaid;
    if (normalizedStatus) {
      if (normalizedStatus === 'suspended') {
        
        filter.status = { [Op.ne]: 'Suspended' };  
      } else {
        filter.status = normalizedStatus;  
      }
    } else {
      
      filter.status = { [Op.ne]: 'Suspended' };
    }

    
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
    const { status, endAt,  } = req.body;

    const normalizedStatus = status ? status.trim().toLowerCase() : undefined;

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const client = await ClientModel.findOne({ where: { userId: id } });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    let updateData = { status: normalizedStatus };

    if (normalizedStatus === 'active') {
      const subscribeAt = new Date();  
      const endAt = new Date();
      endAt.setDate(subscribeAt.getDate() + 30);  


      await ClientModel.update(
        {
          subscribeAt, 
          endAt
        },
        {
          where: { userId: id } 
        }
      );

      updateData = {
        ...updateData,
        subscribeAt,
        endAt,
      };
    }

    if (normalizedStatus === 'deactive' || normalizedStatus === 'suspended') {
      const subscribeAt = new Date();  
      const endAt = new Date();
      endAt.setDate(subscribeAt.getDate() + 30);  

      updateData = {
        ...updateData,
        subscribeAt: null,
        endAt: null
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



export const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await ClientModel.findOne({ where: { userId: id } });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updateData = {
      plan: 'n/a',         
      paid: 'false',
      dataUsage: 0,       
      status: 'deactived', 
      subscribeAt: null,  
      endAt: null,        
    };

    const [updated] = await ClientModel.update(updateData, { where: { userId: id } });

    if (!updated) {
      return res.status(404).json({ message: "No changes made to the subscription" });
    }

    res.status(200).json({ message: "Subscription successfully updated to deactive" });
  } catch (error) {
    console.error("Error in deleteSubscription controller:", error);
    res.status(500).json({ message: "An error occurred while updating the subscription" });
  }
};


export const updateDataUsage = async (req, res) => {
  try {
    const users = await ClientModel.findAll({
      attributes: ["userId", "dataUsage", "plan"],
    });

    console.log("users:", users);

    const planIncrements = {
      Ultimate: 5,
      Premium: 4,
      Standard: 3,
      Basic: 2,
    };

    let totalIncrementedData = 0; 

    for (const user of users) {
      const increment = planIncrements[user.plan] || 0;  
      const newDataUsage = user.dataUsage + increment;

      await ClientModel.update(
        { dataUsage: newDataUsage },
        { where: { userId: user.userId, status: "active" } }
      );

      totalIncrementedData += increment;
    }

    await AnalyticsModel.increment(
      { totalDataTransfered: totalIncrementedData },
      { where: {} }  
    );

    return res.status(200).json({
      message: "All users' data usage updated successfully, and total data transferred updated.",
    });
  } catch (error) {
    console.error("Error updating data usage for all users:", error.message);
    return res.status(500).json({
      message: "Error in updating data usage.",
    });
  }
};

export const createSubscription = async (req, res) =>{
  const{email,plan} = req.body;

  try{

    const account = await UserProfileModel.findOne({
      where: {email: email}
    });

    if(!account){
      return res.status(200).json({message: "no account found"});
    }
    let fullName = '${account.firstName} ${account.lastName}'
    await ClientModel.create({
      userId: account.userId,
      name: fullName,
      plan,
      paid: "True",
      status: "Pending",
      subscribeAt,
      endAt
    });

    return res.status(200).json({message: "succesful"});
  }catch(error){
    console.log(error);
  }
};




