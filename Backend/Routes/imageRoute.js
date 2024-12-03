import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../authentication.js'; 
import { uploadUserImage, getProfile } from '../Controllers/imageController.js'; 

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Apply authentication middleware to this route
router.post('/', authenticateToken, upload.single('image'), uploadUserImage);

router.get('/', authenticateToken, getProfile);

export default router;
