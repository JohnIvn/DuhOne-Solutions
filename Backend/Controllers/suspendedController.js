import UserProfileModel from "../Models/userProfileModel.js";
import { ClientModel } from "../Models/clientModel.js";

export const getAllSuspended = async (req, res) => {
  try {
    console.log("Fetching suspended clients...");

    const suspendedClients = await UserProfileModel.findAll({
      where: { status: "Suspended" },
      attributes: ["userId", "firstName", "lastName", "email", "status"],
    });

    if (suspendedClients.length === 0) {
      return res.json({ message: "No suspended clients found." });
    }
    const clients = suspendedClients.map((client) =>
      client.get({ plain: true })
    );

    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching suspended clients:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const unsuspend = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("id: ", id);
    const subscription = await ClientModel.findOne({
      where: { userId: id },
    });

    console.log(subscription);
    if (subscription) {
      await subscription.update({ status: "Pending" });
    }
    const account = await UserProfileModel.findOne({
      where: { userId: id },
    });
    console.log(account);

    if (!account) {
      return res.status(403).json({ message: "User profile not found." });
    }

    await account.update({ status: "Pending" });

    return res
      .status(200)
      .json({
        message:
          "The client is now unsuspended and status is set to 'Pending'.",
      });
  } catch (error) {
    console.error("Error in trying to unsuspend:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
