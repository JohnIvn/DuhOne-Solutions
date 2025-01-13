import Analytics from "../Models/analyticsModel.js";

export const getAllAnalytics = async (req, res) => {
  try {
    const analyticsData = await Analytics.findAll();

    if (!analyticsData || analyticsData.length === 0) {
      return res.status(404).json({ message: "No analytics data found" });
    }

    const analytics = analyticsData[0];

    res.status(200).json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};

export default getAllAnalytics;
