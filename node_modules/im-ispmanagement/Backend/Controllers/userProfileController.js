import UserProfileModel from '../Models/userProfileModel.js';

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.user; 
        console.log("userId: ", userId);

        const response = await UserProfileModel.findOne({
            where: { userId }
        });

        if (!response) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        console.log("response: ", response);

        return res.json(response);

    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { firstName, lastName, email, role } = req.body;

        if (!firstName || !lastName || !email || !role) {
            return res.status(400).json({ message: 'All fields (firstName, lastName, email, role) are required' });
        }

        const userProfile = await UserProfileModel.findOne({
            where: { userId }
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const updatedUserProfile = await userProfile.update({
            firstName,
            lastName,
            email,
            role,
        });

        return res.json(updatedUserProfile);

    } catch (error) {
        console.error("Error during profile update: ", error);
        return res.status(500).json({ message: 'Failed to update user profile' });
    }
};



