import { get } from "http";
import { subscription } from "../Models/subscriptionModel.js";

export const getDataUsage = async (req, res) => {
    try {
      const dataUsage = await subscription.findAll({
        attributes: ['userId', 'dataUsage', 'subscribeAt', 'endAt'],
        where: { status: 'Active' }, 
      });
  
      console.log(dataUsage)
      res.json(dataUsage);
    } catch (error) {
      console.error("Error fetching data usage:", error);
      res.status(500).json({ error: "Failed to fetch data usage" });
    }
  };
  

export default getDataUsage
