import express from 'express';
import authenticateToken from '../Middleware/authentication.js'; 
import { getProfilePicture } from '../Controllers/imageController.js';

const router = express.Router();

router.get('/', authenticateToken, getProfilePicture);


export default router;
