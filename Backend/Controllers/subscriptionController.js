import { subscription } from "../Models/subscriptionModel.js";
import db from '../database.js';

export const subscriptionController = async (req, res) => {
    const { userId, email, plan } = req.body;

    if (!userId || !email || !plan) {
        return res.status(400).json({ message: "Bad Request: Missing required fields (userId, email, plan)." });
    }

    if(req.user.email != email) return res.status(403).json({message: "Forbidden: email mismatch"});

    try {
        const createPlan = await subscription.create({
            userId, 
            email,
            plan,
            subscribedAt: new Date(), 
            endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
        });

        return res.status(201).json({
            message: "Subscription created successfully!",
            subscription: createPlan,
        });
    } catch (error) {
        console.error("Error in subscription creation: ", error);
        return res.status(500).json({
            message: "Internal server error. Could not create subscription.",
            error: error.message,
        });
    }
};
