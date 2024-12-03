import { ClientModel } from '../Models/clientModel.js'; 

export const getClients = async (req, res) => {
  try {
    const { plan, status, paid } = req.query;

    const normalizedPlan = plan ? plan.trim().toLowerCase() : undefined;
    const normalizedStatus = status ? status.trim().toLowerCase() : undefined;
    const normalizedPaid = paid ? paid.trim().toLowerCase() : undefined;

    const filter = {};
    if (normalizedPlan) filter.plan = normalizedPlan;  
    if (normalizedStatus) filter.status = normalizedStatus;  
    if (normalizedPaid) filter.paid = normalizedPaid; 

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
