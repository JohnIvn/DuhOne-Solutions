import UserProfileModel from "../Models/userProfileModel.js";
import { BankAccount } from "../Models/bankAccountModel.js";
import { ClientModel } from "../Models/clientModel.js";


export const subscriptionTransactionGetCredentials = async (req, res) => {
    try {
        const { userId } = req.user;
        const account = await UserProfileModel.findOne({ where: { userId } });

        if (!account) {
            return res.status(404).json({ error: "User profile not found" });
        }

        return res.json(account);
    } catch (error) {
        console.error("Error fetching user credentials:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const subscriptionTransactionUpdateCredentials = async (req, res) => {
    try {
        const { userId } = req.user;
        const { phoneNumber, street, city, barangay, zipCode, plan, paymentMethod } = req.body;
        console.log(req.body);
        const account = await UserProfileModel.findOne({ where: { userId } });

        if (!account) {
            return res.status(404).json({ error: "User profile not found" });
        }

        await account.update({
            phoneNumber,
            street,
            city,
            barangay,
            zipCode,
            plan,
            paymentMethod,
        });

        await BankAccount.update(
            {
                bankName: paymentMethod,
            },
            {
                where: { BankAccountId: userId }, 
            }
        );     
        return res.json(account);
    } catch (error) {
        console.error("Error updating user credentials:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updatePayment = async (req, res) => {
    const {userid} = req.user;
    const {plan, price} = req.body;

    const account = await UserProfileModel.findOne({
        where: { userId }
    });

    

}
