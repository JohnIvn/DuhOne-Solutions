import { BankAccount } from '../Models/bankAccountModel.js';
import { ClientModel } from '../Models/clientModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const checkBalance = async (req, res) => {
    try {
        const { userId } = req.user;
        const { price } = req.body; 

        const account = await BankAccount.findOne({
            where: { BankAccountId: userId },
        });

        if (!account) {
            return res.status(404).json({ message: "Bank account not found." });
        }
  
        if (account.balance >= price) {
            return res.status(200).json({
                message: "Sufficient balance to buy the plan.",
                balance: account.balance,
            });
        } else {
            return res.status(400).json({
                message: "Insufficient balance to buy the plan.",
                balance: account.balance,
            });
        }
    } catch (error) {
        console.error("Error in checkBalance:", error);
        return res.status(500).json({
            message: "An error occurred while checking balance.",
            error,
        });
    }
};

export const checkUserSubscription = async (req, res) => {
    try {
        const { userId } = req.user; 

        
        const subscription = await ClientModel.findOne({
            where: {
                userId,
            },
        });
        
        if (subscription) {
            
            if (subscription.plan !== 'n/a') {
                return res.status(200).json({
                    message: "User is already subscribed to a plan.",
                    subscription,
                });
            } else {
                
                return res.status(200).json({
                    message: "User has no active subscription (plan is n/a). Proceeding to next steps.",
                    subscription,
                });
            }
        } 
    } catch (error) {
        console.error("Error in checkUserSubscription:", error);
        return res.status(500).json({
            message: "An error occurred while checking user subscription.",
            error,
        });
    }
};
