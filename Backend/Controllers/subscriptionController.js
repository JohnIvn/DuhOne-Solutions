import { subscription } from '../Models/subscriptionModel.js';
import UserProfileModel from '../Models/userProfileModel.js';

export const subscriptionController = async (req, res) => {
    try {
        const { userId, firstName, lastName, email } = req.user || {};
        const { plan } = req.body;

        console.log("Request Body: ", req.body);

        if (!userId || !plan) {
            return res.status(400).json({
                message: "Bad Request: Missing required fields (userId or plan).",
            });
        }

        const name = `${firstName} ${lastName}`;
        const existingSubscription = await subscription.findOne({ where: { userId } });

        if (existingSubscription) {
            await existingSubscription.update({ plan });

            return res.status(200).json({
                message: "Subscription updated successfully!",
                subscription: existingSubscription,
            });
        }

        const newSubscription = await subscription.create({
            userId,
            name,
            plan,
            paid: 'No',
            status: 'pending',
            subscribeAt: null,
            endAt: null,
        });

        const [userProfile, isNewProfile] = await UserProfileModel.findOrCreate({
            where: { userId },
            defaults: {
                userId,
                firstName,
                lastName,
                email,
                plan,
            },
        });

        if (!isNewProfile) {
            await userProfile.update({ plan });
        }

        return res.status(201).json({
            message: "Subscription created successfully!",
            subscription: newSubscription,
        });

    } catch (error) {
        console.error("Error in subscription creation: ", error.message);
        return res.status(500).json({
            message: "Internal server error. Could not process subscription.",
            error: error.message,
        });
    }
};
