import { subscription } from "../Models/subscriptionModel.js";

export const getPlanDistribution = async (req, res) => {
  try {
    const planDistribution = await subscription.findAll({
      attributes: [
        "plan",
        [sequelize.fn("COUNT", sequelize.col("plan")), "planCount"],
      ],
      group: ["plan"],
      raw: true,
    });

    if (!planDistribution || planDistribution.length === 0) {
      return res.status(404).json({ message: "No subscription data found" });
    }

    res.status(200).json(planDistribution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching plan distribution" });
  }
};

export default getPlanDistribution;
