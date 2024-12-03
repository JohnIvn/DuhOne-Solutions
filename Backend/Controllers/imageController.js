// controllers/userImgController.js
import fs from 'fs';
import UserImgModel from '../Models/imageModel.js';

const uploadUserImage = (req, res) => {
    // Get userId from the authenticated user (after token validation)
    const userId = req.user.userId;  // This assumes authenticateToken has populated req.user

    if (!userId) {
        return res.status(400).send('User not authenticated or userId is missing.');
    }

    const imagePath = req.file.path; // Assuming the file was uploaded via Multer

    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Server Error');
        }

        UserImgModel.create({ userId, imageData: data })
            .then(() => {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
                res.send('User image uploaded and stored in database.');
            })
            .catch((err) => {
                console.error('Error inserting into database:', err);
                res.status(500).send('Database Error');
            });
    });
};

const getProfile = async (req, res) => {
  try {
      const user = await UserAccount.findOne({
          where: { userId: req.user.userId }, // Assuming userId is attached after JWT verification
          attributes: ['firstName', 'lastName', 'email', 'imageData'], // Adjust attributes as needed
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user); // Send back user data
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

export { uploadUserImage, getProfile };
