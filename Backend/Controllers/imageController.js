import UserImgModel from "../Models/imageModel.js";

const uploadUserImage = async (req, res) => {
  const { userId } = req.user;
  const imagePath = req.file.filename;

  try {
    const existingImage = await UserImgModel.findOne({ where: { userId } });

    if (existingImage) {
      existingImage.imagePath = imagePath;
      await existingImage.save();
    } else {
      await UserImgModel.create({
        userId,
        imagePath,
      });
    }

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      path: `/uploads/${imagePath}`,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Error uploading profile image" });
  }
};

const getProfilePicture = async (req, res) => {
  const { userId } = req.user;

  try {
    const userImage = await UserImgModel.findOne({ where: { userId } });

    if (!userImage) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const imageUrl = `/uploads/${userImage.imagePath}`;

    return res.status(200).json({ path: imageUrl });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({
        message: "An unexpected error occurred. Please try again later.",
      });
  }
};

export { uploadUserImage, getProfilePicture };
