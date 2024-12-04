import express from 'express';
import { getUserProfile, updateUserProfile } from '../Controllers/userProfileController.js';
import { uploadUserImage, getProfilePicture } from '../Controllers/imageController.js'; 
import authenticateToken from '../Middleware/authentication.js';
import upload from '../Middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getUserProfile);
router.post('/', authenticateToken, updateUserProfile);  

router.post('/image-upload', authenticateToken, upload.single('image'), (req, res, next) => {
    console.log('File uploaded successfully:', req.file); 
    next(); 
  }, uploadUserImage);
router.get('/get-Image', authenticateToken, getProfilePicture);

export default router;
