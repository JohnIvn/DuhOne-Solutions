import express from 'express';
import { createReview, getReviews } from '../Controllers/reviewController.js';  
import authenticateToken from '../authentication.js';  

const router = express.Router();

router.post('/', authenticateToken, createReview);  
router.get('/', getReviews);  

export default router;
