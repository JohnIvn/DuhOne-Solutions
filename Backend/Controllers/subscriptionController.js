import {subscription} from '../Models/subscriptionModel.js'

export const subscriptionController = async (req, res) => {
    const { userId, firstName, lastName } = req.user;
    const {plan} = req.body;

    console.log("Request Body: ", req.body);

    if (!plan) {
        return res.status(400).json({
            message: "Bad Request: Missing required fields (userId, plan)."
        });
    }

    const name = `${firstName} ${lastName}`;

    try {
        const createPlan = await subscription.create({
            userId,
            name,
            plan 
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