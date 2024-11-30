import express from 'express'
import { getUserProfile, updateUserProfile } from '../Controllers/userProfileController.js';
import authenticateToken from '../authentication.js'
const router = express.Router()

router.get('/', authenticateToken, getUserProfile);

router.post('/', authenticateToken, updateUserProfile);


export default router;