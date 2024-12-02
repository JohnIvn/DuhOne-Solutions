import UserImgModel from '../Models/imageModel.js';

export const createUserImg = async (req, res) => {
  try {
    const { userId, imageData } = req.body; 
    const newImage = await UserImgModel.create({
      userId,
      imageData,
    });
    return res.status(201).json({ message: 'Image created successfully', newImage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create image', error: error.message });
  }
};

export const getUserImg = async (req, res) => {
  const { userId } = req.params;
  try {
    const userImage = await UserImgModel.findOne({
      where: { userId },
    });

    if (!userImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).send(userImage.imageData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve image', error: error.message });
  }
};
