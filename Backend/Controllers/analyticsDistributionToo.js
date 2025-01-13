import { subscription } from "../Models/subscriptionModel.js";

const getStatusDistribution = async (req, res) => {
  try {
    // Group by status and count occurrences
    const statusDistribution = await subscription.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    // Format response
    const distribution = statusDistribution.map((entry) => ({
      status: entry.status,
      count: entry.dataValues.count,
    }));

    // Send response
    res.status(200).json({
      message: "Status distribution retrieved successfully.",
      data: distribution,
    });
  } catch (error) {
    console.error("Error retrieving status distribution:", error);
    res.status(500).json({
      message: "An error occurred while retrieving status distribution.",
      error: error.message,
    });
  }
};

export default getStatusDistribution;
