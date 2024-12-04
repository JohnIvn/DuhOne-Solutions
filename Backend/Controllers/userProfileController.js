import UserProfileModel from "../Models/userProfileModel.js";

export const getUserProfile = async (req, res) => {
    
    console.log('get user profile has been called.');
    try {
        const { userId } = req.user; 
        console.log("userId: ", userId);

        const userProfile = await UserProfileModel.findOne({
            where: { userId }
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        console.log("response: ", userProfile);
        return res.json(userProfile);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { firstName, lastName, phoneNumber, street, city, barangay, zipCode } = req.body;

        const userProfile = await UserProfileModel.findOne({
            where: { userId }
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const updatedUserProfile = await userProfile.update({
            firstName,
            lastName,
            phoneNumber,
            street,
            city, 
            barangay, 
            zipCode
        });

        return res.json(updatedUserProfile);

    } catch (error) {
        console.error("Error during profile update: ", error);
        return res.status(500).json({ message: 'Failed to update user profile' });
    }
};
