import express from 'express';
import { createUserImg, getUserImg } from '../Controllers/imageController.js';
import authenticateToken from '../authentication.js'; 

const router = express.Router();

router.post('/', authenticateToken, createUserImg);

router.get('/:userId', authenticateToken, getUserImg);

export default router;
